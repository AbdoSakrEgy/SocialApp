import z, { email } from "zod";
import { Gender, Role } from "../user/user.model.js";

export const registerSchema = z
  .object({
    firstName: z.string().min(3).max(50),
    lastName: z.string().min(3).max(50),
    age: z.number().min(18).max(200).optional(),
    gender: z.literal([Gender.male, Gender.female]).optional(),
    phone: z.string().optional(),
    role: z.literal([Role.admin, Role.customer, Role.seller]).optional(),
    email: z.email(),
    password: z.string(),
  })
  .superRefine((args, ctx) => {
    if (args.phone) {
      const clean = args.phone.replace(/[\s-]/g, "");
      const phoneRegex = /^\+?[1-9]\d{7,14}$/;
      if (!phoneRegex.test(clean)) {
        ctx.addIssue({
          code: "custom",
          path: ["phone"],
          message: "Phone number is incorrect",
        });
      }
    }
    if (args.email) {
      if (args.email == "zzzzz@gmail.com") {
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message:
            "zzzzz@gmail.com not valid email to use :), test custom validation",
        });
      }
    }
  });

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const confirmEmailSchema = z.object({
  email: z.email(),
  firstOtp: z.string(),
  secondOtp: z.string(),
});

export const resendEmailOtpSchema = z.object({
  email: z.email(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
});

export const forgetPasswordSchema = z.object({
  email: z.email(),
});

export const changePasswordSchema = z.object({
  email: z.email(),
  otp: z.string(),
  newPassword: z.string(),
});
