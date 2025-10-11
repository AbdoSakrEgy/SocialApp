import z from "zod";
import { Gender } from "./user.model";

export const updateBasicInfoSchema = z.object({
  firstName: z.string().min(3).max(50).optional(),
  lastName: z.string().min(3).max(50).optional(),
  age: z.number().min(18).max(200).optional(),
  gender: z.literal([Gender.male, Gender.female]).optional(),
  phone: z.string().optional(),
});

export const uploadAvatarImageSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
});

export const getFileFromKeyPreSignedURLSchema = z.object({
  download: z.boolean(),
  downloadName: z.string().optional(),
});

export const deleteFilesUsingKeySchema = z.object({
  Keys: z.array(z.string()),
  Quiet: z.boolean().optional(),
});
