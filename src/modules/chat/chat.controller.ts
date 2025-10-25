import { Router } from "express";
import { ChatServices } from "./chat.service";
import { auth } from "../../middlewares/auth.middleware";

const router = Router();
const chatServices = new ChatServices();

router.get("/:userId/chat", auth, chatServices.getChat);

export default router;
