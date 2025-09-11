"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const user_service_1 = require("./user.service");
const userServices = new user_service_1.UserServices();
router.get("/say-hello", userServices.sayHello);
router.get("/get-user", userServices.getUser);
exports.default = router;
