"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router_v1 = (0, express_1.Router)();
const user_controller_1 = __importDefault(require("./modules/user/user.controller"));
router_v1.use("/users", user_controller_1.default);
exports.default = router_v1;
