"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_service_1 = __importDefault(require("./post.service"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const multer_local_1 = require("../../utils/multer/multer.local");
const post_validation_1 = require("./post.validation");
const router = (0, express_1.Router)();
const postServices = new post_service_1.default();
router.post("/create-post", auth_middleware_1.auth, (0, multer_local_1.multerLocal)({ dest: "Posts attachments" }).array("attachments"), (0, validation_middleware_1.validation)(post_validation_1.createPostSchema), postServices.createPost);
router.get("/posts/:id", auth_middleware_1.auth, postServices.allPosts);
exports.default = router;
