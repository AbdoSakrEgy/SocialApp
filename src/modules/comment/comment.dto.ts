import z from "zod";
import {
  addCommentSchema,
  deleteCommentSchema,
  getCommentSchema,
  updateCommentSchema,
} from "./comment.validation";

export type addCommentDTO = z.infer<typeof addCommentSchema>;
export type updateCommentDTO = z.infer<typeof updateCommentSchema>;
export type deleteCommentDTO = z.infer<typeof deleteCommentSchema>;
export type getCommentDTO = z.infer<typeof getCommentSchema>;
