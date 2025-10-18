import z from "zod";
import {
  createPostSchema,
  likePostSchema,
  deletePostSchema,
  updatePostSchema,
  getPostSchema,
} from "./post.validation";

export type createPostDTO = z.infer<typeof createPostSchema>;
export type likePostDTO = z.infer<typeof likePostSchema>;
export type updatePostDTO = z.infer<typeof updatePostSchema>;
export type deletePostDTO = z.infer<typeof deletePostSchema>;

export type getPostDTO = z.infer<typeof getPostSchema>;
