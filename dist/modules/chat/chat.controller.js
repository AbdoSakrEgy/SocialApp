"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_service_1 = require("./chat.service");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const chatServices = new chat_service_1.ChatServices();
router.get("/:userId/chat", auth_middleware_1.auth, chatServices.getChat);
exports.default = router;
