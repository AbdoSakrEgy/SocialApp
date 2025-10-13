import { Router } from "express";
import PostServices from "./post.service";
import { auth } from "../../middlewares/auth.middleware";
import { validation } from "../../middlewares/validation.middleware";
import {
  createPostSchema,
  likePostSchema,
  updatePostSchema,
} from "./post.validation";
import { multerUpload } from "../../utils/multer/multer.upload";
const router = Router();
const postServices = new PostServices();

router.post(
  "/create-post",
  auth,
  multerUpload({}).array("attachments", 4),
  validation(createPostSchema),
  postServices.createPost
);
router.post(
  "/like-post/:postId",
  auth,
  validation(likePostSchema),
  postServices.likePost
);
router.patch(
  "/update-post/:postId",
  auth,
  multerUpload({}).array("newAttachments"),
  validation(updatePostSchema),
  postServices.updatePost
);

export default router;
