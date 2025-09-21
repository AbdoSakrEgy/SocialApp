import { Router } from "express";
const router = Router();
import { UserServices } from "./user.service";
import { validation } from "../../middlewares/validation.middleware";
import { registerSchema } from "./user.validation";

const userServices = new UserServices();

router.post("/register", validation(registerSchema), userServices.register);
router.post("/login", userServices.login);
router.get("/get-user", userServices.getUser);

export default router;
