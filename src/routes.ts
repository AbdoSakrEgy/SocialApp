import { Router } from "express";
const router = Router();
import userRouter from "./modules/user/user.controller";

router.use("/user", userRouter);

export default router;
