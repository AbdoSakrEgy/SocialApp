"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const successHandler_1 = require("../../utils/successHandler");
const post_repo_1 = require("./post.repo");
const user_repo_1 = require("../user/user.repo");
const Errors_1 = require("../../utils/Errors");
const S3_services_1 = require("../../utils/multer/S3.services");
const nanoid_1 = require("nanoid");
const mongoose_1 = require("mongoose");
const post_model_1 = require("./post.model");
const send_email_1 = require("../../utils/sendEmail/send.email");
const createOtp_1 = require("../../utils/createOtp");
const generateHTML_1 = require("../../utils/sendEmail/generateHTML");
class PostServices {
    postModel = new post_repo_1.PostRepo();
    userModel = new user_repo_1.UserRepo();
    constructor() { }
    // ============================ createPost ============================
    createPost = async (req, res, next) => {
        const user = res.locals.user;
        const files = req.files;
        const { content, avilableFor, isCommentsAllowed, tags } = req.body;
        const assetsFolderId = (0, nanoid_1.nanoid)(15);
        const dest = `users/${user._id}/posts/${assetsFolderId}`;
        let attachments = [];
        // step: check tags existence
        if (tags?.length == 0) {
            const users = await this.userModel.find({
                filter: { _id: { $in: tags } },
            });
            if (users?.length != tags.length) {
                throw new Errors_1.ApplicationExpection("There is some users not found in tags", 400);
            }
        }
        // step: store attachments
        if (files?.length) {
            attachments = await (0, S3_services_1.uploadMultiFilesS3)({
                dest,
                filesFromMulter: files,
            });
        }
        // step: create post
        const post = await this.postModel.create({
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
            const taggedUser = await this.userModel.findOne({ filter: { _id: tag } });
            if (!taggedUser?.email || !taggedUser?.firstName) {
                throw new Errors_1.ApplicationExpection("Tagged user not found", 404);
            }
            const otpCode = (0, createOtp_1.createOtp)();
            const { isEmailSended, info } = await (0, send_email_1.sendEmail)({
                to: taggedUser.email,
                subject: "SocialApp",
                html: (0, generateHTML_1.template)({
                    otpCode,
                    receiverName: taggedUser.firstName,
                    subject: `${user.firstName} tagged you in his post`,
                }),
            });
            if (!isEmailSended) {
                throw new Errors_1.ApplicationExpection("Error while sending email", 400);
            }
        });
        return (0, successHandler_1.successHandler)({
            res,
            message: "Post created successfully",
            result: { post },
        });
    };
    // ============================ likePost ============================
    likePost = async (req, res, next) => {
        const user = res.locals.user;
        const { postId } = req.params;
        // step: find post
        const post = await this.postModel.findOne({
            filter: {
                _id: postId,
                $or: (0, post_model_1.avilabiltyConditation)(user),
            },
        });
        if (!post) {
            throw new Errors_1.ApplicationExpection("Post not found or you don't have access to like this post", 404);
        }
        // step: check if user can like
        if (!post.createdBy.equals(user._id)) {
            const postAuther = await this.userModel.findOne({
                filter: { _id: post.createdBy },
            });
            if (postAuther?.blockList.includes(user._id)) {
                throw new Errors_1.ApplicationExpection("You are not authorized to like this Post", 401);
            }
            if (post.avilableFor == post_model_1.PostAvilableForEnum.FRIENDS &&
                !postAuther?.friends.includes(user._id)) {
                throw new Errors_1.ApplicationExpection("You are not authorized to like this post", 401);
            }
            if (post.avilableFor == post_model_1.PostAvilableForEnum.PRIVATE &&
                !post.tags.includes(user._id)) {
                throw new Errors_1.ApplicationExpection("You are not authorized to like this post", 401);
            }
        }
        // step: add or remove like
        let updatedPost;
        if (post.likes.includes(user._id)) {
            updatedPost = await this.postModel.findOneAndUpdate({
                filter: { _id: post._id },
                data: { $pull: { likes: user._id } },
            });
        }
        else {
            updatedPost = await this.postModel.findOneAndUpdate({
                filter: { _id: post._id },
                data: { $push: { likes: user._id } },
            });
        }
        return (0, successHandler_1.successHandler)({ res });
    };
    // ============================ updatePost ============================
    updatePost = async (req, res, next) => {
        const user = res.locals.user;
        const postId = req.params.postId;
        const { content, removedAttachments = [], avilableFor, isCommentsAllowed, newTags = [], removedTags = [], } = req.body;
        const newAttachments = req.files;
        let newAttachmentsKeys = [];
        let updatedPost;
        // step: check post existence
        updatedPost = await this.postModel.findOne({
            filter: { _id: postId, createdBy: user._id },
        });
        if (!updatedPost) {
            throw new Errors_1.ApplicationExpection("Post not found", 404);
        }
        //* Way1
        // step: upload and delete attachments from S3
        if (newAttachments.length > 0) {
            newAttachmentsKeys = await (0, S3_services_1.uploadMultiFilesS3)({
                dest: `users/${user._id}/posts/${updatedPost?.assetsFolderId}`,
                filesFromMulter: newAttachments,
            });
        }
        if (removedAttachments.length > 0) {
            await (0, S3_services_1.deleteMultiFilesS3)({ Keys: removedAttachments });
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
                                    removedTags.map((id) => mongoose_1.Types.ObjectId.createFromHexString(id)), // removedTags is an array of strings, but $tags is an array of ObjectIds, so we convert removedTags to ObjectId
                                ],
                            },
                            newTags.map((newtag) => {
                                return mongoose_1.Types.ObjectId.createFromHexString(newtag);
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
        //   updatedPost = await this.postModel.findOneAndUpdate({
        //     filter: { _id: postId },
        //     data: { $pull: { attachments: { $in: removedAttachments } } }, // $pull => $in | $addToSet,$push => $each
        //   });
        // }
        // if (newAttachments.length > 0) {
        //   newAttachmentsKeys = await uploadMultiFilesS3({
        //     dest: `users/${user._id}/posts/${updatedPost?.assetsFolderId}`,
        //     filesFromMulter: newAttachments,
        //   });
        //   updatedPost = await this.postModel.findOneAndUpdate({
        //     filter: { _id: postId },
        //     data: { $addToSet: { attachments: { $each: newAttachmentsKeys } } },
        //   });
        // }
        // // step: update content
        // if (content) {
        //   updatedPost = await this.postModel.findOneAndUpdate({
        //     filter: { _id: postId },
        //     data: { $set: { content } },
        //   });
        // }
        // // step:update avilableFor
        // if (avilableFor) {
        //   updatedPost = await this.postModel.findOneAndUpdate({
        //     filter: { _id: postId },
        //     data: { $set: { avilableFor } },
        //   });
        // }
        // // step:update isCommentsAllowed
        // if (isCommentsAllowed) {
        //   updatedPost = await this.postModel.findOneAndUpdate({
        //     filter: { _id: postId },
        //     data: { $set: { isCommentsAllowed } },
        //   });
        // }
        // // step: update tags
        // if (newTags && newTags.length > 0) {
        //   const isUsersToTagsExist = await this.userModel.find({
        //     filter: {
        //       _id: { $in: newTags },
        //     },
        //   });
        //   if (newTags?.length != isUsersToTagsExist?.length) {
        //     throw new ApplicationExpection("Some tags users not found", 404);
        //   }
        //   updatedPost = await this.postModel.findOneAndUpdate({
        //     filter: { _id: postId },
        //     data: { $addToSet: { tags: { $each: newTags } } },
        //   });
        // }
        // if (removedTags && removedTags.length > 0) {
        //   updatedPost = await this.postModel.findOneAndUpdate({
        //     filter: { _id: postId },
        //     data: { $pull: { tags: { $in: removedTags } } },
        //   });
        // }
        return (0, successHandler_1.successHandler)({ res, message: "Post updated successfully" });
    };
    // ============================ getPost ============================
    getPost = async (req, res, next) => {
        const user = res.locals.user;
        const { postId } = req.params;
        // step: check post existence
        const post = await this.postModel.findOne({ filter: { _id: postId } });
        if (!post) {
            throw new Errors_1.ApplicationExpection("Post not found", 404);
        }
        // step: check if user can get post
        if (!post.createdBy.equals(user._id)) {
            const postAuther = await this.userModel.findOne({
                filter: { _id: post.createdBy },
            });
            if (postAuther?.blockList.includes(user._id)) {
                throw new Errors_1.ApplicationExpection("You are not authorized to get this Post", 401);
            }
            if (post.avilableFor == post_model_1.PostAvilableForEnum.FRIENDS &&
                !postAuther?.friends.includes(user._id)) {
                throw new Errors_1.ApplicationExpection("You are not authorized to get this Post", 401);
            }
            if (post.avilableFor == post_model_1.PostAvilableForEnum.PRIVATE &&
                !post.tags.includes(user._id)) {
                throw new Errors_1.ApplicationExpection("You are not authorized to get this Post", 401);
            }
        }
        return (0, successHandler_1.successHandler)({ res, result: { post } });
    };
    // ============================ softDeletePost ============================
    softDeletePost = async (req, res, next) => {
        const user = res.locals.user;
        const postId = req.params.postId;
        // step: check post existence
        const post = await this.postModel.findOne({ filter: { _id: postId } });
        if (!post) {
            throw new Errors_1.ApplicationExpection("Post not found", 404);
        }
        // step: check user authorization
        if (!post.createdBy.equals(user._id)) {
            throw new Errors_1.ApplicationExpection("You are not authorized to delete post", 401);
        }
        // step: delete post
        const updatedPost = await this.postModel.findOneAndUpdate({
            filter: { _id: postId },
            data: { $set: { isDeleted: true } },
        });
        return (0, successHandler_1.successHandler)({ res, message: "Post soft deleted successfully" });
    };
    // ============================ hardDeletePost ============================
    hardDeletePost = async (req, res, next) => {
        const user = res.locals.user;
        const postId = req.params.postId;
        // step: check post existence
        const post = await this.postModel.findOne({ filter: { _id: postId } });
        if (!post) {
            throw new Errors_1.ApplicationExpection("Post not found", 404);
        }
        // step: check user avilability
        if (!post.createdBy.equals(user._id)) {
            throw new Errors_1.ApplicationExpection("You are not authorized to delete post", 401);
        }
        // step: delete post
        const updatedPost = await this.postModel.findOneAndDelete({
            filter: { _id: postId },
        });
        return (0, successHandler_1.successHandler)({ res, message: "Post hard deleted successfully" });
    };
    // ============================ addComment ============================
    addComment = async (req, res, next) => {
        const user = res.locals.user;
        const { postId, comment } = req.body;
        // step: check post existence
        const post = await this.postModel.findOne({ filter: { _id: postId } });
        if (!post) {
            throw new Errors_1.ApplicationExpection("Post not found", 404);
        }
        // step: check is comments allowed
        if (!post.isCommentsAllowed) {
            throw new Errors_1.ApplicationExpection("Comments not allowed", 400);
        }
        // step: check if user can comment
        if (!post.createdBy.equals(user._id)) {
            const postAuther = await this.userModel.findOne({
                filter: { _id: post.createdBy },
            });
            if (postAuther?.blockList.includes(user._id)) {
                throw new Errors_1.ApplicationExpection("You are not authorized to comment this Post", 401);
            }
            if (post.avilableFor == post_model_1.PostAvilableForEnum.FRIENDS &&
                !postAuther?.friends.includes(user._id)) {
                throw new Errors_1.ApplicationExpection("You are not authorized to comment", 401);
            }
            if (post.avilableFor == post_model_1.PostAvilableForEnum.PRIVATE &&
                !post.tags.includes(user._id)) {
                throw new Errors_1.ApplicationExpection("You are not authorized to comment", 401);
            }
        }
        // step: add comment
        const updatedPost = await this.postModel.findOneAndUpdate({
            filter: { _id: postId },
            data: {
                $push: {
                    comments: {
                        commenter: user._id,
                        comment,
                    },
                },
            },
        });
        return (0, successHandler_1.successHandler)({
            res,
            message: "Comment added successfully",
            result: { updatedPost },
        });
    };
    // ============================ getComment ============================
    getComment = async (req, res, next) => {
        const user = res.locals.user;
        const { postId, commentId } = req.body;
        // step: check post and comment existence
        const post = await this.postModel.findOne({ filter: { _id: postId } });
        if (!post) {
            throw new Errors_1.ApplicationExpection("Post not found", 404);
        }
        let comment;
        if (post.comments) {
            for (let item of post.comments) {
                if (item?._id?.equals(commentId)) {
                    comment = item;
                }
            }
        }
        if (!comment) {
            throw new Errors_1.ApplicationExpection("Comment not found", 404);
        }
        // step: check if user can get comment
        if (!post.createdBy.equals(user._id)) {
            const postAuther = await this.userModel.findOne({
                filter: { _id: post.createdBy },
            });
            if (postAuther?.blockList.includes(user._id)) {
                throw new Errors_1.ApplicationExpection("You are not authorized to get this comment", 401);
            }
            if (post.avilableFor == post_model_1.PostAvilableForEnum.FRIENDS &&
                !postAuther?.friends.includes(user._id)) {
                throw new Errors_1.ApplicationExpection("You are not authorized to get this comment", 401);
            }
            if (post.avilableFor == post_model_1.PostAvilableForEnum.PRIVATE &&
                !post.tags.includes(user._id)) {
                throw new Errors_1.ApplicationExpection("You are not authorized to get this comment", 401);
            }
        }
        return (0, successHandler_1.successHandler)({ res, result: { comment } });
    };
    // ============================ updateComment ============================
    updateComment = async (req, res, next) => {
        const user = res.locals.user;
        const { postId, commentId, newComment } = req.body;
        // step: check post and comment existence
        const post = await this.postModel.findOne({ filter: { _id: postId } });
        if (!post) {
            throw new Errors_1.ApplicationExpection("Post not found", 404);
        }
        let comment;
        if (post.comments) {
            for (let item of post.comments) {
                if (item?._id?.equals(commentId)) {
                    comment = item;
                }
            }
        }
        if (!comment) {
            throw new Errors_1.ApplicationExpection("Comment not found", 404);
        }
        // step: check user authorization
        if (!post.createdBy.equals(user._id)) {
            throw new Errors_1.ApplicationExpection("You are not authorized to update this post", 401);
        }
        // step: update comment
        const updatedPost = await this.postModel.findOneAndUpdate({
            filter: { _id: postId },
            data: { $set: { "comments.$[elem].comment": newComment } },
            options: {
                arrayFilters: [{ "elem._id": commentId }],
            },
        });
        console.log(updatedPost);
        return (0, successHandler_1.successHandler)({
            res,
            message: "Comment updated successfully",
            result: updatedPost,
        });
    };
    // ============================ deleteComment ============================
    deleteComment = async (req, res, next) => {
        const user = res.locals.user;
        const { postId, commentId } = req.body;
        // step: check post and comment existence
        const post = await this.postModel.findOne({ filter: { _id: postId } });
        if (!post) {
            throw new Errors_1.ApplicationExpection("Post not found", 404);
        }
        let comment;
        if (post.comments) {
            for (let item of post.comments) {
                if (item?._id?.equals(commentId)) {
                    comment = item;
                }
            }
        }
        if (!comment) {
            throw new Errors_1.ApplicationExpection("Comment not found", 404);
        }
        // step: check user authorization
        if (!post.createdBy.equals(user._id)) {
            throw new Errors_1.ApplicationExpection("You are not authorized to delete this post", 401);
        }
        // step: delete comment
        const updatedPost = await this.postModel.findOneAndUpdate({
            filter: { _id: postId },
            data: { $pull: { comments: { _id: commentId } } },
        });
        return (0, successHandler_1.successHandler)({ res, message: "Comment deleted successfully" });
    };
}
exports.default = PostServices;
