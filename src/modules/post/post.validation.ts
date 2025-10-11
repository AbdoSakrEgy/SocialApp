import z from "zod";
import { AvilableForEnum } from "./post.model.js";
import { fileTypes } from "../../utils/multer/multer.local.js";

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
      .enum(Object.values(AvilableForEnum))
      .default(AvilableForEnum.PUBLIC)
      .optional(),
    isCommentsAllowed: z.boolean().default(true).optional(),
    likes: z.array(z.string()).optional(),
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
