"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolves = void 0;
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const user_repo_1 = require("../../../modules/user/user.repo");
class UserResolves {
    userRepo = new user_repo_1.UserRepo();
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
    getAllUsers = async (parent, args, context, info) => {
        const { user, payload } = await (0, auth_middleware_1.authGraphQL)(args.token);
        const users = await this.userRepo.find({ filter: {} });
        return users;
    };
}
exports.userResolves = new UserResolves();
