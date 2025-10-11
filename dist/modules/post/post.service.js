"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const successHandler_1 = require("../../utils/successHandler");
class PostServices {
    constructor() { }
    // ============================ createPost ============================
    createPost = async (req, res, next) => {
        return (0, successHandler_1.successHandler)({ res });
    };
    // ============================ allPosts ============================
    allPosts = async (req, res, next) => {
        return (0, successHandler_1.successHandler)({ res });
    };
}
exports.default = PostServices;
