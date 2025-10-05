import { Router } from "express";
const router = Router();
import userRouter from "./modules/user/user.controller";
import authRouter from "./modules/auth/auth.controller";
import postRouter from "./modules/post/post.controller";

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/post", postRouter);

export default router;
