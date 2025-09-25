import { UserModel } from "./user.model";
import { DBRepo } from "../../DB/db.repo";
import { successHandler } from "../../utils/successHandler";
import { NextFunction, Request, Response } from "express";
// import { UserRepo } from "./user.repo";

interface IUserServices {}

export class UserServices implements IUserServices {
  private userModel = new DBRepo(UserModel);
  // private userModel = new UserRepo();

  constructor() {}

  // userProfile
  userProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user;
    return successHandler({ res, result: user });
  };
}
