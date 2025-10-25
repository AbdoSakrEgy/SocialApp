import { Router } from "express";
import { ChatServices } from "./chat.service";
import { auth } from "../../middlewares/auth.middleware";

const router = Router();
const chatServices = new ChatServices();

router.get("/get-chat/:chatId", auth, chatServices.getChat);
router.post("/create-chat/:userId", auth, chatServices.createChat);
router.post("/create-chat-group", auth, chatServices.createChatGroup);

export default router;
