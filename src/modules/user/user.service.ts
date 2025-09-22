import { IUser, UserModel } from "./user.model";
import { NextFunction, Request, Response } from "express";
import { ApplicationExpection, NotValidEmail } from "../../utils/Errors";
import { registerDTO } from "./user.DTO";
import { HydratedDocument } from "mongoose";
import { DBRepo } from "../../DB/db.repo";
import { sendEmail } from "../../utils/sendEmail/sendEmail";
import { template } from "../../utils/sendEmail/generateHTML";
import { createOtp } from "../../utils/createOtp";
import { successHandler } from "../../utils/successHandler";
import { compare } from "../../utils/bcrypt";
// import { UserRepo } from "./user.repo";

interface IUserServices {
  register(req: Request, res: Response, next: NextFunction): Promise<Response>;
  confirmEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
}

export class UserServices implements IUserServices {
  private userModel = new DBRepo(UserModel);
  // private userModel = new UserRepo();

  constructor() {}

  // register
  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { firstName, lastName, email, password }: registerDTO = req.body;
    // step: check user existance
    const isUserExist = await this.userModel.findOne({
      filter: { email },
      options: { lean: true },
    });
    if (isUserExist) {
      throw new NotValidEmail("User already exist");
    }
    // step: send otp to email
    //! const otpCode = createOtp();
    const otpCode = "555";
    const { isEmailSended, info } = await sendEmail({
      to: email,
      subject: "ECommerceApp",
      html: template({
        otpCode,
        receiverName: firstName,
        subject: "Confirm email",
      }),
    });
    if (!isEmailSended) {
      return successHandler({
        res,
        message: "Error while checking email",
        status: 400,
      });
    }
    if (!isEmailSended) {
      throw new ApplicationExpection("Error while sending email", 400);
    }
    // step: create new user
    const user: HydratedDocument<IUser> = await this.userModel.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        emailOtp: {
          otp: otpCode,
          expiresIn: new Date(Date.now() + 60 * 60 * 1000),
        },
      },
    });
    if (!user) {
      throw new ApplicationExpection("Creation failed", 500);
    }
    return successHandler({ res, message: "User created successfully" });
  };

  // confirmEmail
  confirmEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { email, firstOtp, secondOtp } = req.body;
    // step: check user exitance
    const user = await this.userModel.findOne({ filter: { email } });
    if (!user) {
      throw new ApplicationExpection("User not found", 400);
    }
    // step: check emailOtp
    if (!(await compare(firstOtp, user.emailOtp.otp))) {
      return successHandler({ res, message: "Invalid otp", status: 400 });
    }
    if (user.emailOtp.expiresIn < new Date(Date.now())) {
      return successHandler({ res, message: "otp expired", status: 400 });
    }
    // step: case 1 email not confrimed (confirm first email)
    if (!user.emailConfirmed) {
      // step: confirm email
      const updatedUser = await this.userModel.findOneAndUpdate({
        filter: { email: user.email },
        data: { $set: { emailConfirmed: true } },
      });
      return successHandler({ res, message: "Email confirmed successfully" });
    }
    // step: case 2 email confrimed (confirm first and second email)
    // step: check secondOtp existance
    if (!secondOtp) {
      return successHandler({
        res,
        message:
          "Email already confirmed, if you want to update email please send firstOtp and secondOtp",
        status: 400,
      });
    }
    // step: check newEmailOtp
    if (!(await compare(secondOtp, user.newEmailOtp.otp))) {
      return successHandler({
        res,
        message: "Invalid otp for second email",
        status: 400,
      });
    }
    if (user.newEmailOtp.expiresIn < new Date(Date.now())) {
      return successHandler({
        res,
        message: "otp expired for second email",
        status: 400,
      });
    }
    // step: confirm email
    const newEmail = user.newEmail;
    const updatedUser = await this.userModel.findOneAndUpdate({
      filter: { email: user.email },
      data: { $set: { email: newEmail } },
    });
    return successHandler({
      res,
      message: "New email confirmed successfully",
    });
  };
}
