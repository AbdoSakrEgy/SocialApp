import { Router } from "express";
import { AuthServices } from "./auth.service";
import { validation } from "../../middlewares/validation.middleware";
import {
  changePasswordSchema,
  confirmEmailSchema,
  forgetPasswordSchema,
  loginSchema,
  registerSchema,
  resendEmailOtpSchema,
  updateEmailSchema,
  updatePasswordSchema,
} from "./auth.validation";
import { auth } from "../../middlewares/auth.middleware";
const router = Router();

const authServices = new AuthServices();

router.post("/register", validation(registerSchema), authServices.register);
router.post("/login", validation(loginSchema), authServices.login);
router.post("/refresh-token", authServices.refreshToken);
router.post(
  "/confirm-email",
  validation(confirmEmailSchema),
  authServices.confirmEmail
);
router.patch(
  "/update-email",
  auth,
  validation(updateEmailSchema),
  authServices.updateEmail
);
router.post(
  "/resend-email-otp",
  validation(resendEmailOtpSchema),
  authServices.resendEmailOtp
);
router.patch(
  "/update-password",
  auth,
  validation(updatePasswordSchema),
  authServices.updatePassword
);
router.post(
  "/forget-password",
  validation(forgetPasswordSchema),
  authServices.forgetPassword
);
router.patch(
  "/change-password",
  validation(changePasswordSchema),
  authServices.changePassword
);
router.post("/logout", auth, authServices.logout);

export default router;
