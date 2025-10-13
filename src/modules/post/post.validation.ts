import z from "zod";
import { PostAvilableForEnum } from "./post.model.js";
import { fileTypes } from "../../utils/multer/multer.upload.js";

export const createPostSchema = z
  .object({
    content: z.string().optional(),
    attachments: z
      .array(
        z.object({
          fieldname: z.enum(["attachments"]),
          originalname: z.string(),
          encoding: z.string(),
          mimetype: z.enum(fileTypes.image),
          destination: z.string().optional(),
          filename: z.string().optional(),
          path: z.string().optional(),
          buffer: z.any().optional(),
          size: z.number(),
        })
      )
      .optional(),
    avilableFor: z
      .enum(Object.values(PostAvilableForEnum) as [string, ...string[]]) // Since your enum uses string values
      .default(PostAvilableForEnum.PUBLIC)
      .optional(),
    isCommentsAllowed: z.boolean().default(true).optional(),
    likes: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
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

export const likePostSchema = z.object({
  postId: z.string(),
});

export const updatePostSchema = z.object({
  postId: z.string(),
  content: z.string().optional(),
  newAttachments: z
    .array(
      z.object({
        fieldname: z.enum(["newAttachments"]),
        originalname: z.string(),
        encoding: z.string(),
        mimetype: z.enum(fileTypes.image),
        destination: z.string().optional(),
        filename: z.string().optional(),
        path: z.string().optional(),
        buffer: z.any().optional(),
        size: z.number(),
      })
    )
    .optional(),
  removedAttachments: z.array(z.string()).optional(),
  avilableFor: z
    .enum(Object.values(PostAvilableForEnum) as [string, ...string[]])
    .optional(),
  isCommentsAllowed: z.string().optional(), // string not boolean, because this field will send from body form-data in postman
  newTags: z.array(z.string()).optional(),
  removedTags: z.array(z.string()).optional(),
});
