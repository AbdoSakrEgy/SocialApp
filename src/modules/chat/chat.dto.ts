import z from "zod";
import { createChatGroupSchema, getChatSchema } from "./chat.validation";

export type getChatDTO = z.infer<typeof getChatSchema>;
export type createChatGroupDTO = z.infer<typeof createChatGroupSchema>;
