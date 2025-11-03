"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentServices = void 0;
const successHandler_1 = require("../../utils/successHandler");
const post_repo_1 = require("../post/post.repo");
const user_repo_1 = require("../user/user.repo");
const Errors_1 = require("../../utils/Errors");
const comment_repo_1 = require("./comment.repo");
const comment_model_1 = require("./comment.model");
const comment_searcher_1 = require("./helpers/comment.searcher");
const post_module_types_1 = require("../../types/post.module.types");
class CommentServices {
    commentRepo = new comment_repo_1.CommentRepo();
    postRepo = new post_repo_1.PostRepo();
    userRepo = new user_repo_1.UserRepo();
    constructor() { }
    // ============================ addComment ============================
    addComment = async (req, res, next) => {
        const user = res.locals.user;
        const { postId, parentCommentId = null, commentContent, mentions, } = req.body;
        // step: check post existence
        const post = await this.postRepo.findOne({ filter: { _id: postId } });
        if (!post) {
            throw new Errors_1.ApplicationExpection("Post not found", 404);
        }
        // step: check is comments allowed
        if (!post.isCommentsAllowed) {
            throw new Errors_1.ApplicationExpection("Comments not allowed", 400);
        }
        // step: check if user can comment
        if (!post.createdBy.equals(user._id)) {
            const postAuther = await this.userRepo.findOne({
                filter: { _id: post.createdBy },
            });
            if (postAuther?.blockList.includes(user._id)) {
                throw new Errors_1.ApplicationExpection("You are not authorized to comment this Post", 401);
            }
            if (post.avilableFor == post_module_types_1.PostAvilableForEnum.FRIENDS &&
                !postAuther?.friends.includes(user._id)) {
                throw new Errors_1.ApplicationExpection("You are not authorized to comment", 401);
            }
            if (post.avilableFor == post_module_types_1.PostAvilableForEnum.PRIVATE &&
                !post.tags.includes(user._id)) {
                throw new Errors_1.ApplicationExpection("You are not authorized to comment", 401);
            }
        }
        // step: add comment
        const comment = await this.commentRepo.create({
            data: { ...req.body, commenterId: user._id },
        });
        return (0, successHandler_1.successHandler)({
            res,
            message: "Comment added successfully",
            result: { comment },
        });
    };
    // ============================ updateComment ============================
    updateComment = async (req, res, next) => {
        const user = res.locals.user;
        const { postId, commentId, newCommentContent, newMentions } = req.body;
        // step: check post existence
        const post = await this.postRepo.findOne({ filter: { _id: postId } });
        if (!post) {
            throw new Errors_1.ApplicationExpection("Post not found", 404);
        }
        // step: check comment existence
        const comment = await this.commentRepo.findOne({
            filter: { _id: commentId },
        });
        if (!comment) {
            throw new Errors_1.ApplicationExpection("Comment not found", 404);
        }
        // step: check if user can update comment
        if (!user._id.equals(comment.commenterId)) {
            throw new Errors_1.ApplicationExpection("You are not authorized to update this comment", 401);
        }
        // step: update comment
        const updatedComment = await this.commentRepo.findOneAndUpdate({
            filter: { _id: commentId },
            data: {
                $set: { commentContent: newCommentContent, mentions: newMentions },
            },
        });
        return (0, successHandler_1.successHandler)({
            res,
            message: "Comment added successfully",
            result: { updatedComment },
        });
    };
    // ============================ deleteComment ============================
    deleteComment = async (req, res, next) => {
        const user = res.locals.user;
        const { postId, commentId } = req.body;
        // step: check post existence
        const post = await this.postRepo.findOne({ filter: { _id: postId } });
        if (!post) {
            throw new Errors_1.ApplicationExpection("Post not found", 404);
        }
        // step: check comment existence
        const comment = await this.commentRepo.findOne({
            filter: { _id: commentId },
        });
        if (!comment) {
            throw new Errors_1.ApplicationExpection("Comment not found", 404);
        }
        // step: check if user can delete comment
        if (!user._id.equals(comment.commenterId)) {
            throw new Errors_1.ApplicationExpection("You are not authorized to delete this comment", 404);
        }
        // step: delete comment + all descendants
        const commentWithReplies = await (0, comment_searcher_1.getAllChildCommentIds)(commentId, comment_model_1.CommentModel);
        await this.commentRepo.deleteMany({
            filter: { _id: { $in: commentWithReplies } },
        });
        await this.commentRepo.findOneAndDelete({ filter: { _id: commentId } });
        return (0, successHandler_1.successHandler)({
            res,
            message: "Comment and child comments deleted successfully",
        });
    };
    // ============================ getComment ============================
    getComment = async (req, res, next) => {
        const user = res.locals.user;
        const { commentId, withChildComments = false } = req.body;
        // step: check comment existence
        const comment = await this.commentRepo.findOne({
            filter: { _id: commentId },
        });
        if (!comment) {
            throw new Errors_1.ApplicationExpection("Comment not found", 404);
        }
        if (!withChildComments) {
            return (0, successHandler_1.successHandler)({ res, result: { comment } });
        }
        // step: get comments
        const childCommentIds = await (0, comment_searcher_1.getAllChildComments)(commentId, comment_model_1.CommentModel);
        return (0, successHandler_1.successHandler)({ res, result: { comment, childCommentIds } });
    };
}
exports.CommentServices = CommentServices;
