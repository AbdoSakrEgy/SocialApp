"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostSchema = exports.deletePostSchema = exports.updatePostSchema = exports.likePostSchema = exports.createPostSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const multer_upload_js_1 = require("../../utils/multer/multer.upload.js");
const post_module_types_js_1 = require("../../types/post.module.types.js");
exports.createPostSchema = zod_1.default
    .object({
    content: zod_1.default.string().optional(),
    attachments: zod_1.default
        .array(zod_1.default.object({
        fieldname: zod_1.default.enum(["attachments"]),
        originalname: zod_1.default.string(),
        encoding: zod_1.default.string(),
        mimetype: zod_1.default.enum(multer_upload_js_1.fileTypes.image),
        destination: zod_1.default.string().optional(),
        filename: zod_1.default.string().optional(),
        path: zod_1.default.string().optional(),
        buffer: zod_1.default.any().optional(),
        size: zod_1.default.number(),
    }))
        .optional(),
    avilableFor: zod_1.default
        .enum(Object.values(post_module_types_js_1.PostAvilableForEnum)) // Since your enum uses string values
        .default(post_module_types_js_1.PostAvilableForEnum.PUBLIC)
        .optional(),
    isCommentsAllowed: zod_1.default.boolean().default(true).optional(),
    likes: zod_1.default.array(zod_1.default.string()).optional(),
    tags: zod_1.default.array(zod_1.default.string()).optional(),
})
    .superRefine((args, ctx) => {
    if (!args.content && (!args.attachments || args.attachments.length == 0)) {
        ctx.addIssue({
            code: "custom",
            path: ["content", "phone"],
            message: "Either content or attachments are required to create a post",
        });
    }
});
exports.likePostSchema = zod_1.default.object({
    postId: zod_1.default.string(),
});
exports.updatePostSchema = zod_1.default.object({
    postId: zod_1.default.string(),
    content: zod_1.default.string().optional(),
    newAttachments: zod_1.default
        .array(zod_1.default.object({
        fieldname: zod_1.default.enum(["newAttachments"]),
        originalname: zod_1.default.string(),
        encoding: zod_1.default.string(),
        mimetype: zod_1.default.enum(multer_upload_js_1.fileTypes.image),
        destination: zod_1.default.string().optional(),
        filename: zod_1.default.string().optional(),
        path: zod_1.default.string().optional(),
        buffer: zod_1.default.any().optional(),
        size: zod_1.default.number(),
    }))
        .optional(),
    removedAttachments: zod_1.default.array(zod_1.default.string()).optional(),
    avilableFor: zod_1.default
        .enum(Object.values(post_module_types_js_1.PostAvilableForEnum))
        .optional(),
    isCommentsAllowed: zod_1.default.string().optional(), // string not boolean, because this field will send from body form-data in postman
    newTags: zod_1.default.array(zod_1.default.string()).optional(),
    removedTags: zod_1.default.array(zod_1.default.string()).optional(),
});
exports.deletePostSchema = zod_1.default.object({
    postId: zod_1.default.string(),
});
exports.getPostSchema = zod_1.default.object({
    postId: zod_1.default.string(),
});
