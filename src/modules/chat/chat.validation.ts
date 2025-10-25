import z from "zod";
import mongoose from "mongoose";

const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  })
  .transform((val) => new mongoose.Types.ObjectId(val));

export const getChatSchema = z.object({
  chatId: z.string(),
});

export const createChatGroupSchema = z.object({
  groupName: z.string(),
  participants: z.array(objectIdSchema),
});
