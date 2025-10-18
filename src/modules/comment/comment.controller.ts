import { CommentServices } from "./comment.service";
import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware";
import { validation } from "../../middlewares/validation.middleware";
import {
  addCommentSchema,
  deleteCommentSchema,
  getCommentSchema,
  updateCommentSchema,
} from "./comment.validation";
const router = Router();
const commentServices = new CommentServices();

router.post(
  "/add-comment",
  auth,
  validation(addCommentSchema),
  commentServices.addComment
);
router.patch(
  "/update-comment",
  auth,
  validation(updateCommentSchema),
  commentServices.updateComment
);
router.delete(
  "/delete-comment",
  auth,
  validation(deleteCommentSchema),
  commentServices.deleteComment
);
router.get(
  "/get-comment",
  auth,
  validation(getCommentSchema),
  commentServices.getComment
);

export default router;
