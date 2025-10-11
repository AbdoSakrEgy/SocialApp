import { UserModel } from "./user.model";
import { DBRepo } from "../../DB/db.repo";
import { successHandler } from "../../utils/successHandler";
import { NextFunction, Request, Response } from "express";
import { UserRepo } from "./user.repo";
import { updateBasicInfoDTO } from "./user.dto";
import { uploadFileS3 } from "../../utils/multer/S3.services";
// import { UserRepo } from "./user.repo";

interface IUserServices {}

export class UserServices implements IUserServices {
  // private userModel = new DBRepo(UserModel);
  private userModel = new UserRepo();

  constructor() {}

  // ============================ userProfile ============================
  userProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user;
    return successHandler({ res, result: user });
  };

  // ============================ uploadProfileImage ============================
  uploadProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const path = await uploadFileS3({ file: req.file as Express.Multer.File });
    return successHandler({
      res,
      message: "Image uploaded successfully",
      result: { path },
    });
  };

  // ============================ updateBasicInfo ============================
  updateBasicInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user;
    const { firstName, lastName, age, gender, phone }: updateBasicInfoDTO =
      req.body;
    // step: update basic info
    const updatedUser = await this.userModel.findOneAndUpdate({
      filter: { _id: user._id },
      data: { $set: { firstName, lastName, age, gender, phone } },
    });
    if (!updatedUser) {
      return successHandler({
        res,
        message: "Error while update user",
        status: 500,
      });
    }
    return successHandler({ res, message: "User updated successfully" });
  };
}
