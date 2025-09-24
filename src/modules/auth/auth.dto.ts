import z from "zod";
import {
  confirmEmailSchema,
  loginSchema,
  registerSchema,
  resendEmailOtpSchema,
} from "./auth.validation";

export type registerDTO = z.infer<typeof registerSchema>;
export type confirmEmaiDTO = z.infer<typeof confirmEmailSchema>;
export type resendEmailOtpDTO = z.infer<typeof resendEmailOtpSchema>;
export type loginDTO = z.infer<typeof loginSchema>;
