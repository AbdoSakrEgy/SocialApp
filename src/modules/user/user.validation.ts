import z from "zod";
import { Gender } from "./user.model";

export const updateBasicInfoSchema = z.object({
  firstName: z.string().min(3).max(50).optional(),
  lastName: z.string().min(3).max(50).optional(),
  age: z.number().min(18).max(200).optional(),
  gender: z.literal([Gender.male, Gender.female]).optional(),
  phone: z.string().optional(),
});
