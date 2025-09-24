"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const user_model_1 = require("./user.model");
const db_repo_1 = require("../../DB/db.repo");
class UserServices {
    userModel = new db_repo_1.DBRepo(user_model_1.UserModel);
    // private userModel = new UserRepo();
    constructor() { }
}
exports.UserServices = UserServices;
