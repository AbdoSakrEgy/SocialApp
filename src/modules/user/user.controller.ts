import { Router } from "express";
const router = Router();
import { UserServices } from "./user.service";
import { validation } from "../../middlewares/validation.middleware";
import {
  confirmEmailSchema,
  loginSchema,
  registerSchema,
  resendEmailOtpSchema,
} from "./user.validation";

const userServices = new UserServices();

router.post("/register", validation(registerSchema), userServices.register);
router.post("/login", validation(loginSchema), userServices.login);
// router.post("/refresh-token");
router.post(
  "/confirm-email",
  validation(confirmEmailSchema),
  userServices.confirmEmail
);
// router.patch("/update-email");
router.post(
  "/resend-email-otp",
  validation(resendEmailOtpSchema),
  userServices.resendEmailOtp
);
// router.patch("/update-password");
// router.post("/forget-password");
// router.patch("/change-password");
// router.post("/logout");

export default router;
