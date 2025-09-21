import { IUser, UserModel } from "./user.model";
import { NextFunction, Request, Response } from "express";
import {
  ApplicationExpection,
  NotValidEmail,
  ValidationError,
} from "../../utils/Errors";
import { registerSchema } from "./user.validation";
import { DBServices } from "../../DB/db.services";
import { registerDTO } from "./user.DTO";
import { HydratedDocument } from "mongoose";

interface IUserServices {
  register(req: Request, res: Response, next: NextFunction): Promise<Response>;
  login(req: Request, res: Response, next: NextFunction): Promise<Response>;
  getUser(req: Request, res: Response, next: NextFunction): Promise<Response>;
}

export class UserServices implements IUserServices {
  private userModel = new DBServices<IUser>(UserModel);

  constructor() {}

  // register
  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { firstName, lastName, email, password }: registerDTO = req.body;
    // step: check user existance
    const isUserExist = await this.userModel.findOne({ filter: { email } });
    console.log(isUserExist);
    if (isUserExist) {
      throw new NotValidEmail("User already exist");
    }
    // step: create new user
    const user: HydratedDocument<IUser> = await this.userModel.create({
      data: { firstName, lastName, email, password },
    });
    if (!user) {
      throw new ApplicationExpection("Creation failed", 500);
    }
    return res.status(201).json({ message: "User created successfully" });
  };

  // login
  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    return res.status(201).json({ message: "Done" });
  }

  // getUser
  async getUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    return res.status(201).json({ message: "Done" });
  }
}
