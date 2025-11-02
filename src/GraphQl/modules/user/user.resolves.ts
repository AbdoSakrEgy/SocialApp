import { authGraphQL } from "../../../middlewares/auth.middleware";
import { UserRepo } from "../../../modules/user/user.repo";

class UserResolves {
  private userRepo = new UserRepo();

  getAllUsers = async (parent: any, args: any, context: any, info: any) => {
    const { user, payload } = await authGraphQL(context.token);
    const users = await this.userRepo.find({ filter: {} });
    return users;
  };
  getUserProfile = async (parent: any, args: any, context: any, info: any) => {
    const { user, payload } = await authGraphQL(context.token);
    return user;
  };
}

export const userResolves = new UserResolves();
