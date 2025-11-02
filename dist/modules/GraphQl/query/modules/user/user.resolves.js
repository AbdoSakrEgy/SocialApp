"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolves = exports.UserResolves = void 0;
const user_repo_1 = require("../../../../user/user.repo");
class UserResolves {
    userRepo = new user_repo_1.UserRepo();
    hello = () => {
        return "hello graphql";
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
exports.UserResolves = UserResolves;
exports.userResolves = new UserResolves();
