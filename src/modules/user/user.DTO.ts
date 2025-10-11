import z from "zod";
import {
  deleteFilesUsingKeySchema,
  getFileFromKeyPreSignedURLSchema,
  updateBasicInfoSchema,
  uploadAvatarImageSchema,
} from "./user.validation";

export type updateBasicInfoDTO = z.infer<typeof updateBasicInfoSchema>;
export type uploadAvatarImageDTO = z.infer<typeof uploadAvatarImageSchema>;
export type getFileFromKeyPreSignedURLDTO = z.infer<
  typeof getFileFromKeyPreSignedURLSchema
>;
export type deleteFilesUsingKeyDTO = z.infer<typeof deleteFilesUsingKeySchema>;
