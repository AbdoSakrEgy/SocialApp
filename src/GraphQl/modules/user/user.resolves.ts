import { authGraphQL } from "../../../middlewares/auth.middleware";
import { UserRepo } from "../../../modules/user/user.repo";

class UserResolves {
  private userRepo = new UserRepo();

  hello = () => {
    return "hello";
  };
  sayhi = (parent: any, args: any, context: any, info: any) => {
    return `Hi ${args.name}`;
  };
  user = async () => {
    const user = await this.userRepo.findOne({ filter: { id: "" } });
    return user;
  };
  getAllUsers = async (parent: any, args: any, context: any, info: any) => {
    const { user, payload } = await authGraphQL(args.token);
    const users = await this.userRepo.find({ filter: {} });
    return users;
  };
}

export const userResolves = new UserResolves();
