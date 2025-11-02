"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolves = void 0;
const user_repo_1 = require("../../../modules/user/user.repo");
class UserResolves {
    userRepo = new user_repo_1.UserRepo();
    signup = () => {
    };
    hello = () => {
        return "hello";
    };
    sayhi = (parent, args, context, info) => {
        return `Hi ${args.name}`;
    };
    user = async () => {
        const user = await this.userRepo.findOne({ filter: { id: "" } });
        return user;
    };
    users = async () => {
        const users = await this.userRepo.find({ filter: {} });
        return users;
    };
}
exports.userResolves = new UserResolves();
