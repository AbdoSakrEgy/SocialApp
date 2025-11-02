"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolves = void 0;
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const user_repo_1 = require("../../../modules/user/user.repo");
class UserResolves {
    userRepo = new user_repo_1.UserRepo();
    getAllUsers = async (parent, args, context, info) => {
        const { user, payload } = await (0, auth_middleware_1.authGraphQL)(context.token);
        const users = await this.userRepo.find({ filter: {} });
        return users;
    };
    getUserProfile = async (parent, args, context, info) => {
        const { user, payload } = await (0, auth_middleware_1.authGraphQL)(context.token);
        return user;
    };
}
exports.userResolves = new UserResolves();
