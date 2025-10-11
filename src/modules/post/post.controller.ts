import { Router } from "express";
import PostServices from "./post.service";
import { auth } from "../../middlewares/auth.middleware";
import { validation } from "../../middlewares/validation.middleware";
import { multerLocal } from "../../utils/multer/multer.local";
import { createPostSchema } from "./post.validation";
const router = Router();
const postServices = new PostServices();

router.post(
  "/create-post",
  auth,
  multerLocal({ dest: "Posts attachments" }).array("attachments"),
  validation(createPostSchema),
  postServices.createPost
);
router.get("/posts/:id", auth, postServices.allPosts);

export default router;
