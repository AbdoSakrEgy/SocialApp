"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJwt = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const createJwt = (payload, privateKey, options) => {
    const token = (0, jsonwebtoken_1.sign)(payload, privateKey, options);
    return token;
};
exports.createJwt = createJwt;
