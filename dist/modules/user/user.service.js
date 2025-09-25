"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const user_model_1 = require("./user.model");
const db_repo_1 = require("../../DB/db.repo");
const successHandler_1 = require("../../utils/successHandler");
class UserServices {
    userModel = new db_repo_1.DBRepo(user_model_1.UserModel);
    // private userModel = new UserRepo();
    constructor() { }
    // userProfile
    userProfile = async (req, res, next) => {
        const user = res.locals.user;
        return (0, successHandler_1.successHandler)({ res, result: user });
    };
}
exports.UserServices = UserServices;
