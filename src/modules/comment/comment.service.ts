import { NextFunction, Request, Response } from "express";
import { successHandler } from "../../utils/successHandler";
import { PostRepo } from "../post/post.repo";
import { UserRepo } from "../user/user.repo";
import { ApplicationExpection } from "../../utils/Errors";
import {
  addCommentDTO,
  deleteCommentDTO,
  getCommentDTO,
  updateCommentDTO,
} from "./comment.dto";
import { CommentRepo } from "./comment.repo";
import { CommentModel } from "./comment.model";
import {
  getAllChildCommentIds,
  getAllChildComments,
} from "./helpers/comment.searcher";
import { PostAvilableForEnum } from "../../types/post.module.types";

export interface ICommentServices {}

export class CommentServices<ICommentServices> {
  private commentRepo = new CommentRepo();
  private postRepo = new PostRepo();
  private userRepo = new UserRepo();

  constructor() {}
  // ============================ addComment ============================
  addComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user;
    const {
      postId,
      parentCommentId = null,
      commentContent,
      mentions,
    } = req.body as addCommentDTO;
    // step: check post existence
    const post = await this.postRepo.findOne({ filter: { _id: postId } });
    if (!post) {
      throw new ApplicationExpection("Post not found", 404);
    }
    // step: check is comments allowed
    if (!post.isCommentsAllowed) {
      throw new ApplicationExpection("Comments not allowed", 400);
    }
    // step: check if user can comment
    if (!post.createdBy.equals(user._id)) {
      const postAuther = await this.userRepo.findOne({
        filter: { _id: post.createdBy },
      });
      if (postAuther?.blockList.includes(user._id)) {
        throw new ApplicationExpection(
          "You are not authorized to comment this Post",
          401
        );
      }
      if (
        post.avilableFor == PostAvilableForEnum.FRIENDS &&
        !postAuther?.friends.includes(user._id)
      ) {
        throw new ApplicationExpection(
          "You are not authorized to comment",
          401
        );
      }
      if (
        post.avilableFor == PostAvilableForEnum.PRIVATE &&
        !post.tags.includes(user._id)
      ) {
        throw new ApplicationExpection(
          "You are not authorized to comment",
          401
        );
      }
    }
    // step: add comment
    const comment = await this.commentRepo.create({
      data: { ...req.body, commenterId: user._id },
    });
    return successHandler({
      res,
      message: "Comment added successfully",
      result: { comment },
    });
  };

  // ============================ updateComment ============================
  updateComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user;
    const { postId, commentId, newCommentContent, newMentions } =
      req.body as updateCommentDTO;
    // step: check post existence
    const post = await this.postRepo.findOne({ filter: { _id: postId } });
    if (!post) {
      throw new ApplicationExpection("Post not found", 404);
    }
    // step: check comment existence
    const comment = await this.commentRepo.findOne({
      filter: { _id: commentId },
    });
    if (!comment) {
      throw new ApplicationExpection("Comment not found", 404);
    }
    // step: check if user can update comment
    if (!user._id.equals(comment.commenterId)) {
      throw new ApplicationExpection(
        "You are not authorized to update this comment",
        401
      );
    }
    // step: update comment
    const updatedComment = await this.commentRepo.findOneAndUpdate({
      filter: { _id: commentId },
      data: {
        $set: { commentContent: newCommentContent, mentions: newMentions },
      },
    });
    return successHandler({
      res,
      message: "Comment added successfully",
      result: { updatedComment },
    });
  };

  // ============================ deleteComment ============================
  deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user;
    const { postId, commentId } = req.body as deleteCommentDTO;
    // step: check post existence
    const post = await this.postRepo.findOne({ filter: { _id: postId } });
    if (!post) {
      throw new ApplicationExpection("Post not found", 404);
    }
    // step: check comment existence
    const comment = await this.commentRepo.findOne({
      filter: { _id: commentId },
    });
    if (!comment) {
      throw new ApplicationExpection("Comment not found", 404);
    }
    // step: check if user can delete comment
    if (!user._id.equals(comment.commenterId)) {
      throw new ApplicationExpection(
        "You are not authorized to delete this comment",
        404
      );
    }
    // step: delete comment + all descendants
    const commentWithReplies = await getAllChildCommentIds(
      commentId,
      CommentModel
    );
    await this.commentRepo.deleteMany({
      filter: { _id: { $in: commentWithReplies } },
    });
    await this.commentRepo.findOneAndDelete({ filter: { _id: commentId } });
    return successHandler({
      res,
      message: "Comment and child comments deleted successfully",
    });
  };

  // ============================ getComment ============================
  getComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user;
    const { commentId, withChildComments = false } = req.body as getCommentDTO;
    // step: check comment existence
    const comment = await this.commentRepo.findOne({
      filter: { _id: commentId },
    });
    if (!comment) {
      throw new ApplicationExpection("Comment not found", 404);
    }
    if (!withChildComments) {
      return successHandler({ res, result: { comment } });
    }
    // step: get comments
    const childCommentIds = await getAllChildComments(commentId, CommentModel);
    return successHandler({ res, result: { comment, childCommentIds } });
  };
}
