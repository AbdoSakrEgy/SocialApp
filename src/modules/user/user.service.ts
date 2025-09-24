import { UserModel } from "./user.model";
import { DBRepo } from "../../DB/db.repo";
// import { UserRepo } from "./user.repo";

interface IUserServices {}

export class UserServices implements IUserServices {
  private userModel = new DBRepo(UserModel);
  // private userModel = new UserRepo();

  constructor() {}
}
