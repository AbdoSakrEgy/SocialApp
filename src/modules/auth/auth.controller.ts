import { Router } from "express";
import { AuthServices } from "./auth.service";
import { validation } from "../../middlewares/validation.middleware";
import {
  confirmEmailSchema,
  loginSchema,
  registerSchema,
  resendEmailOtpSchema,
} from "./auth.validation";
const router = Router();

const authServices = new AuthServices();

router.post("/register", validation(registerSchema), authServices.register);
router.post("/login", validation(loginSchema), authServices.login);
// router.post("/refresh-token");
router.post(
  "/confirm-email",
  validation(confirmEmailSchema),
  authServices.confirmEmail
);
// router.patch("/update-email");
router.post(
  "/resend-email-otp",
  validation(resendEmailOtpSchema),
  authServices.resendEmailOtp
);
// router.patch("/update-password");
// router.post("/forget-password");
// router.patch("/change-password");
// router.post("/logout");

export default router;
