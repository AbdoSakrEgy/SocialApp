import { Router } from "express";
import { ChatService } from "./chat.rest.service";
import { auth } from "../../middlewares/auth.middleware";

const router = Router();
const chatService = new ChatService();

router.get("/:userId/chat", auth, chatService.getChat);

export default router;
