import { Router } from "express";
const router = Router();
import { UserServices } from "./user.service";
import { auth } from "../../middlewares/auth.middleware";

const userServices = new UserServices();

router.get("/user-profile", auth, userServices.userProfile);

export default router;
