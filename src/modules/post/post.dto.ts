import z from "zod";
import {
  createPostSchema,
  likePostSchema,
  updatePostSchema,
} from "./post.validation";

export type createPostDTO = z.infer<typeof createPostSchema>;
export type likePostDTO = z.infer<typeof likePostSchema>;
export type updatePostDTO = z.infer<typeof updatePostSchema>;
