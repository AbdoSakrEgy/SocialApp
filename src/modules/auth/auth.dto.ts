import z from "zod";
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

export type registerDTO = z.infer<typeof registerSchema>;
export type confirmEmaiDTO = z.infer<typeof confirmEmailSchema>;
export type updateEmaiDTO = z.infer<typeof updateEmailSchema>;
export type resendEmailOtpDTO = z.infer<typeof resendEmailOtpSchema>;
export type loginDTO = z.infer<typeof loginSchema>;
export type updatePasswordDTO = z.infer<typeof updatePasswordSchema>;
export type forgetPasswordDTO = z.infer<typeof forgetPasswordSchema>;
export type changePasswordDTO = z.infer<typeof changePasswordSchema>;
