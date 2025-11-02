"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGraphQL = exports.auth = void 0;
const decodeToken_js_1 = require("../utils/decodeToken.js");
const Errors_js_1 = require("../utils/Errors.js");
const auth = async (req, res, next) => {
    // check: authorization
    const { authorization } = req.headers;
    if (!authorization) {
        throw new Errors_js_1.ApplicationExpection("Authorization is required", 400);
    }
    const { user, payload } = await (0, decodeToken_js_1.decodeToken)({
        authorization,
        tokenType: decodeToken_js_1.tokenTypes.access,
    });
    // step: modify res.locals
    res.locals.user = user;
    res.locals.payload = payload;
    // step: modify req for multer.local.upload
    req.user = user;
    return next();
};
exports.auth = auth;
const authGraphQL = async (token) => {
    // check: authorization
    const authorization = token;
    if (!authorization) {
        throw new Errors_js_1.ApplicationExpection("Authorization is required", 400);
    }
    const { user, payload } = await (0, decodeToken_js_1.decodeToken)({
        authorization,
        tokenType: decodeToken_js_1.tokenTypes.access,
    });
    return { user, payload };
};
exports.authGraphQL = authGraphQL;
