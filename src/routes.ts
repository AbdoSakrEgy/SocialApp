import { Router } from "express";
const router = Router();
import userRouter from "./modules/user/user.controller";
import authRouter from "./modules/auth/auth.controller";
import postRouter from "./modules/post/post.controller";
import commentRouter from "./modules/comment/comment.controller";

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/post", postRouter);
router.use("/comment", commentRouter);

export default router;
