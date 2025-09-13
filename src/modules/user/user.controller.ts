import { Router } from "express";
const router = Router();
import { UserServices } from "./user.service";
import { validation } from "../../middlewares/validation.middleware.js";
import { signupSchema } from "./user.validation";

const userServices = new UserServices();

router.post("/signUp", validation(signupSchema), userServices.signUp);
router.post("/login", userServices.login);
router.get("/get-user", userServices.getUser);

export default router;
