import { NextFunction } from "express";
import { Response } from "express";
import { Request } from "express";
import { successHandler } from "../../utils/successHandler";
import { PostRepo } from "./post.repo";
import {
  createPostDTO,
  likePostDTO,
  deletePostDTO,
  updatePostDTO,
  getPostDTO,
} from "./post.dto";
import { UserRepo } from "../user/user.repo";
import { ApplicationExpection } from "../../utils/Errors";
import {
  deleteMultiFilesS3,
  uploadMultiFilesS3,
} from "../../utils/multer/S3.services";
import { nanoid } from "nanoid";
import { HydratedDocument, Types } from "mongoose";
import {
  IPost,
  PostModel,
} from "./post.model";
import { IUser } from "../user/user.model";
import { sendEmail } from "../../utils/sendEmail/send.email";
import { createOtp } from "../../utils/createOtp";
import { template } from "../../utils/sendEmail/generateHTML";
import { CommentRepo } from "../comment/comment.repo";
import { avilabiltyConditation } from "./helpers/avilabilty.conditation";
import { PostAvilableForEnum } from "../../types/post.module.types";

interface IPostServices {
  likePost(req: Request, res: Response, next: NextFunction): Promise<Response>;
  createPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  updatePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
}

class PostServices implements IPostServices {
  private postRepo = new PostRepo();
  private userRepo = new UserRepo();
  private commentRepo = new CommentRepo();

  constructor() {}
  // ============================ createPost ============================
  createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user: HydratedDocument<IUser> = res.locals.user;
    const files = req.files as Express.Multer.File[];
    const { content, avilableFor, isCommentsAllowed, tags }: createPostDTO =
      req.body;
    const assetsFolderId = nanoid(15);
    const dest = `users/${user._id}/posts/${assetsFolderId}`;
    let attachments: string[] = [];

    // step: check tags existence
    if (tags?.length == 0) {
      const users = await this.userRepo.find({
        filter: { _id: { $in: tags } },
      });
      if (users?.length != tags.length) {
        throw new ApplicationExpection(
          "There is some users not found in tags",
          400
        );
      }
    }
    // step: store attachments
    if (files?.length) {
      attachments = await uploadMultiFilesS3({
        dest,
        filesFromMulter: files,
      });
    }
    // step: create post
    const post: HydratedDocument<IPost> = await this.postRepo.create({
      data: {
        ...req.body,
        //! next code not working
        // content,
        // avilableFor,
        // isCommentsAllowed,
        // tags,
        attachments,
        createdBy: user._id,
        assetsFolderId,
      },
    });
    // step: send email for taged users
    tags?.map(async (tag) => {
      const taggedUser = await this.userRepo.findOne({ filter: { _id: tag } });
      if (!taggedUser?.email || !taggedUser?.firstName) {
        throw new ApplicationExpection("Tagged user not found", 404);
      }
      const otpCode = createOtp();
      const { isEmailSended, info } = await sendEmail({
        to: taggedUser.email,
        subject: "SocialApp",
        html: template({
          otpCode,
          receiverName: taggedUser.firstName,
          subject: `${user.firstName} tagged you in his post`,
        }),
      });
      if (!isEmailSended) {
        throw new ApplicationExpection("Error while sending email", 400);
      }
    });
    return successHandler({
      res,
      message: "Post created successfully",
      result: { post },
    });
  };

  // ============================ likePost ============================
  likePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user: HydratedDocument<IUser> = res.locals.user;
    const { postId } = req.params as likePostDTO;
    // step: find post
    const post = await this.postRepo.findOne({
      filter: {
        _id: postId,
        $or: avilabiltyConditation(user),
      },
    });
    if (!post) {
      throw new ApplicationExpection(
        "Post not found or you don't have access to like this post",
        404
      );
    }
    // step: check if user can like
    if (!post.createdBy.equals(user._id)) {
      const postAuther = await this.userRepo.findOne({
        filter: { _id: post.createdBy },
      });
      if (postAuther?.blockList.includes(user._id)) {
        throw new ApplicationExpection(
          "You are not authorized to like this Post",
          401
        );
      }
      if (
        post.avilableFor == PostAvilableForEnum.FRIENDS &&
        !postAuther?.friends.includes(user._id)
      ) {
        throw new ApplicationExpection(
          "You are not authorized to like this post",
          401
        );
      }
      if (
        post.avilableFor == PostAvilableForEnum.PRIVATE &&
        !post.tags.includes(user._id)
      ) {
        throw new ApplicationExpection(
          "You are not authorized to like this post",
          401
        );
      }
    }
    // step: add or remove like
    let updatedPost;
    if (post.likes.includes(user._id)) {
      updatedPost = await this.postRepo.findOneAndUpdate({
        filter: { _id: post._id },
        data: { $pull: { likes: user._id } },
      });
    } else {
      updatedPost = await this.postRepo.findOneAndUpdate({
        filter: { _id: post._id },
        data: { $addToSet: { likes: user._id } },
      });
    }

    return successHandler({ res });
  };

  // ============================ updatePost ============================
  updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user;
    const postId = req.params.postId;
    const {
      content,
      removedAttachments = [],
      avilableFor,
      isCommentsAllowed,
      newTags = [],
      removedTags = [],
    } = req.body as updatePostDTO;
    const newAttachments = req.files as Express.Multer.File[];
    let newAttachmentsKeys: string[] = [];
    let updatedPost: HydratedDocument<IPost> | null;

    // step: check post existence
    updatedPost = await this.postRepo.findOne({
      filter: { _id: postId, createdBy: user._id },
    });
    if (!updatedPost) {
      throw new ApplicationExpection("Post not found", 404);
    }
    //* Way1
    // step: upload and delete attachments from S3
    if (newAttachments.length > 0) {
      newAttachmentsKeys = await uploadMultiFilesS3({
        dest: `users/${user._id}/posts/${updatedPost?.assetsFolderId}`,
        filesFromMulter: newAttachments,
      });
    }
    if (removedAttachments.length > 0) {
      await deleteMultiFilesS3({ Keys: removedAttachments });
    }
    // step: upadte post
    await updatedPost.updateOne([
      {
        $set: {
          content: content || updatedPost.content,
          attachments: {
            $setUnion: [
              { $setDifference: ["$attachments", removedAttachments] },
              newAttachmentsKeys,
            ],
          },
          avilableFor: avilableFor || updatedPost.avilableFor,
          isCommentsAllowed: isCommentsAllowed || updatedPost.isCommentsAllowed,
          tags: {
            $setUnion: [
              {
                $setDifference: [
                  "$tags",
                  removedTags.map((id) =>
                    Types.ObjectId.createFromHexString(id)
                  ), // removedTags is an array of strings, but $tags is an array of ObjectIds, so we convert removedTags to ObjectId
                ],
              },
              newTags.map((newtag) => {
                return Types.ObjectId.createFromHexString(newtag);
              }), // aggregation return it string, so we make it ObjectId
            ],
          },
        },
      },
    ]);
    //* Way2
    // //step: update attachments
    // if (removedAttachments.length > 0) {
    //   await deleteMultiFilesS3({ Keys: removedAttachments });
    //   updatedPost = await this.postRepo.findOneAndUpdate({
    //     filter: { _id: postId },
    //     data: { $pull: { attachments: { $in: removedAttachments } } }, // $pull => $in | $addToSet,$push => $each
    //   });
    // }
    // if (newAttachments.length > 0) {
    //   newAttachmentsKeys = await uploadMultiFilesS3({
    //     dest: `users/${user._id}/posts/${updatedPost?.assetsFolderId}`,
    //     filesFromMulter: newAttachments,
    //   });
    //   updatedPost = await this.postRepo.findOneAndUpdate({
    //     filter: { _id: postId },
    //     data: { $addToSet: { attachments: { $each: newAttachmentsKeys } } },
    //   });
    // }
    // // step: update content
    // if (content) {
    //   updatedPost = await this.postRepo.findOneAndUpdate({
    //     filter: { _id: postId },
    //     data: { $set: { content } },
    //   });
    // }
    // // step:update avilableFor
    // if (avilableFor) {
    //   updatedPost = await this.postRepo.findOneAndUpdate({
    //     filter: { _id: postId },
    //     data: { $set: { avilableFor } },
    //   });
    // }
    // // step:update isCommentsAllowed
    // if (isCommentsAllowed) {
    //   updatedPost = await this.postRepo.findOneAndUpdate({
    //     filter: { _id: postId },
    //     data: { $set: { isCommentsAllowed } },
    //   });
    // }
    // // step: update tags
    // if (newTags && newTags.length > 0) {
    //   const isUsersToTagsExist = await this.userRepo.find({
    //     filter: {
    //       _id: { $in: newTags },
    //     },
    //   });
    //   if (newTags?.length != isUsersToTagsExist?.length) {
    //     throw new ApplicationExpection("Some tags users not found", 404);
    //   }
    //   updatedPost = await this.postRepo.findOneAndUpdate({
    //     filter: { _id: postId },
    //     data: { $addToSet: { tags: { $each: newTags } } },
    //   });
    // }
    // if (removedTags && removedTags.length > 0) {
    //   updatedPost = await this.postRepo.findOneAndUpdate({
    //     filter: { _id: postId },
    //     data: { $pull: { tags: { $in: removedTags } } },
    //   });
    // }

    return successHandler({ res, message: "Post updated successfully" });
  };

  // ============================ getPost ============================
  getPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user;
    const { postId } = req.params as unknown as getPostDTO;
    // step: check post existence
    const post = await this.postRepo.findOne({ filter: { _id: postId } });
    if (!post) {
      throw new ApplicationExpection("Post not found", 404);
    }
    // step: check if user can get post
    if (!post.createdBy.equals(user._id)) {
      const postAuther = await this.userRepo.findOne({
        filter: { _id: post.createdBy },
      });
      if (postAuther?.blockList.includes(user._id)) {
        throw new ApplicationExpection(
          "You are not authorized to get this Post",
          401
        );
      }
      if (
        post.avilableFor == PostAvilableForEnum.FRIENDS &&
        !postAuther?.friends.includes(user._id)
      ) {
        throw new ApplicationExpection(
          "You are not authorized to get this Post",
          401
        );
      }
      if (
        post.avilableFor == PostAvilableForEnum.PRIVATE &&
        !post.tags.includes(user._id)
      ) {
        throw new ApplicationExpection(
          "You are not authorized to get this Post",
          401
        );
      }
    }
    return successHandler({ res, result: { post } });
  };

  // ============================ softDeletePost ============================
  softDeletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user;
    const postId = req.params.postId as unknown as deletePostDTO;
    // step: check post existence
    const post = await this.postRepo.findOne({ filter: { _id: postId } });
    if (!post) {
      throw new ApplicationExpection("Post not found", 404);
    }
    // step: check user authorization
    if (!post.createdBy.equals(user._id)) {
      throw new ApplicationExpection(
        "You are not authorized to delete post",
        401
      );
    }
    // step: delete post
    const updatedPost = await this.postRepo.findOneAndUpdate({
      filter: { _id: postId },
      data: { $set: { isDeleted: true } },
    });
    return successHandler({ res, message: "Post soft deleted successfully" });
  };

  // ============================ hardDeletePost ============================
  hardDeletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user;
    const postId = req.params.postId as unknown as deletePostDTO;
    // step: check post existence
    const post = await this.postRepo.findOne({ filter: { _id: postId } });
    if (!post) {
      throw new ApplicationExpection("Post not found", 404);
    }
    // step: check user avilability
    if (!post.createdBy.equals(user._id)) {
      throw new ApplicationExpection(
        "You are not authorized to delete post",
        401
      );
    }
    // step: delete comments of post
    const commentIds = await this.commentRepo.find({
      filter: {
        postId: post._id,
      },
    });
    await this.commentRepo.deleteMany({
      filter: { _id: { $in: commentIds } },
    });
    // step: delete post
    const updatedPost = await this.postRepo.findOneAndDelete({
      filter: { _id: postId },
    });
    return successHandler({ res, message: "Post hard deleted successfully" });
  };
}

export default PostServices;
