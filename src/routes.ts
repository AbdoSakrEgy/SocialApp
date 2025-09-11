import { Router } from "express";
const router_v1 = Router();
import userRouter from "./modules/user/user.controller";

router_v1.use("/users", userRouter);

export default router_v1;
