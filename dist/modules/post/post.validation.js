"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const post_model_js_1 = require("./post.model.js");
const multer_local_js_1 = require("../../utils/multer/multer.local.js");
exports.createPostSchema = zod_1.default
    .object({
    content: zod_1.default.string().optional(),
    attachments: zod_1.default
        .array(zod_1.default.object({
        fieldname: zod_1.default.enum(["attachments"]),
        originalname: zod_1.default.string(),
        encoding: zod_1.default.string(),
        mimetype: zod_1.default.enum(multer_local_js_1.fileTypes.image),
        destination: zod_1.default.string().optional(),
        filename: zod_1.default.string().optional(),
        path: zod_1.default.string().optional(),
        buffer: zod_1.default.any().optional(),
        size: zod_1.default.number(),
    }))
        .optional(),
    avilableFor: zod_1.default
        .enum(Object.values(post_model_js_1.AvilableForEnum))
        .default(post_model_js_1.AvilableForEnum.PUBLIC)
        .optional(),
    isCommentsAllowed: zod_1.default.boolean().default(true).optional(),
    likes: zod_1.default.array(zod_1.default.string()).optional(),
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
