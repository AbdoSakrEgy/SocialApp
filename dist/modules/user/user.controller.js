"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const user_service_1 = require("./user.service");
const userServices = new user_service_1.UserServices();
// router.get("/user-profile");
exports.default = router;
