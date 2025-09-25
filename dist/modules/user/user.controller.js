"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const user_service_1 = require("./user.service");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const userServices = new user_service_1.UserServices();
router.get("/user-profile", auth_middleware_1.auth, userServices.userProfile);
exports.default = router;
