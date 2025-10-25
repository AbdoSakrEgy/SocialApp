"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_rest_service_1 = require("./chat.rest.service");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const chatService = new chat_rest_service_1.ChatService();
router.get("/:userId/chat", auth_middleware_1.auth, chatService.getChat);
exports.default = router;
