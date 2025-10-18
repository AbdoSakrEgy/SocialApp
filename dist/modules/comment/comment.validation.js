"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentSchema = exports.deleteCommentSchema = exports.updateCommentSchema = exports.addCommentSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.addCommentSchema = zod_1.default.object({
    postId: zod_1.default.string(),
    parentCommentId: zod_1.default.string().optional(),
    commentContent: zod_1.default.string(),
    mentions: zod_1.default.array(zod_1.default.string()).optional(),
});
exports.updateCommentSchema = zod_1.default
    .object({
    postId: zod_1.default.string(),
    commentId: zod_1.default.string(),
    newCommentContent: zod_1.default.string().optional(),
    newMentions: zod_1.default.array(zod_1.default.object()).optional(),
})
    .superRefine((args, ctx) => {
    if (!args.newCommentContent && !args.newMentions) {
        ctx.addIssue({
            code: "custom",
            path: ["newCommentContent", "newMentions"],
            message: "Either newCommentContent or newMentions are required to update comment",
        });
    }
});
exports.deleteCommentSchema = zod_1.default.object({
    postId: zod_1.default.string(),
    commentId: zod_1.default.string(),
});
exports.getCommentSchema = zod_1.default.object({
    postId: zod_1.default.string(),
    commentId: zod_1.default.string(),
    withChildComments: zod_1.default.boolean().optional(),
});
