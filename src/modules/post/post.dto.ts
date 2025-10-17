import z from "zod";
import {
  createPostSchema,
  likePostSchema,
  deletePostSchema,
  updatePostSchema,
  addCommentSchema,
  deleteCommentSchema,
  updateCommentSchema,
} from "./post.validation";

export type createPostDTO = z.infer<typeof createPostSchema>;
export type likePostDTO = z.infer<typeof likePostSchema>;
export type updatePostDTO = z.infer<typeof updatePostSchema>;
export type deletePostDTO = z.infer<typeof deletePostSchema>;
export type addCommentDTO = z.infer<typeof addCommentSchema>;
export type deleteCommentDTO = z.infer<typeof deleteCommentSchema>;
export type updateCommentDTO = z.infer<typeof updateCommentSchema>;
