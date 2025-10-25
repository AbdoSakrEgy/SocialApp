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

export const chatMessageSchema = z.object({
  content: z.string().min(1).max(50),
  sendTo: z.string(),
});
export const chatGroupMessageSchema = z.object({
  content: z.string().min(1).max(50),
  groupId: z.string(),
});
