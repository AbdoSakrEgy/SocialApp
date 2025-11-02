import { HydratedDocument } from "mongoose";
import { registerDTO } from "../../../modules/auth/auth.dto";
import { UserRepo } from "../../../modules/user/user.repo";
import { createOtp } from "../../../utils/createOtp";
import { template } from "../../../utils/sendEmail/generateHTML";
import { sendEmail } from "../../../utils/sendEmail/send.email";
import { IUser } from "../../../modules/user/user.model";
import { createJwt } from "../../../utils/jwt";
import { successHandlerGraphQL } from "../../../utils/successHandler";
import { GraphQLError } from "graphql";
import { registerSchema } from "../../../modules/auth/auth.validation";
import { validationGraphQl } from "../../../middlewares/validation.middleware";

class AuthResolves {
  userRepo = new UserRepo();

  signup = async (parent: any, args: registerDTO, context: any, info1: any) => {
    validationGraphQl(registerSchema, args);
    const { firstName, lastName, email, password } = args;
    // step: check user existence
    const isUserExist = await this.userRepo.findOne({
      filter: { email },
      options: { lean: true },
    });
    if (isUserExist) {
      throw new GraphQLError("User already exist", {
        extensions: {
          status: 400,
        },
      });
    }
    // step: send email otp
    const otpCode = createOtp();

    const { isEmailSended, info } = await sendEmail({
      to: email,
      subject: "SocialApp",
      html: template({
        otpCode,
        receiverName: firstName,
        subject: "Confirm email",
      }),
    });
    if (!isEmailSended) {
      throw new GraphQLError("Error while sending email", {
        extensions: { status: 400 },
      });
    }
    // step: create new user
    const user: HydratedDocument<IUser> = await this.userRepo.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        emailOtp: {
          otp: otpCode,
          expiresIn: new Date(Date.now() + 5 * 60 * 1000),
        },
      },
    });
    if (!user) {
      throw new GraphQLError("Creation failed", {
        extensions: { status: 500 },
      });
    }
    // step: create token
    const accessToken = createJwt(
      { userId: user._id, userEmail: user.email },
      process.env.ACCESS_SEGNATURE as string,
      {
        expiresIn: "1h",
        jwtid: createOtp(),
      }
    );
    const refreshToken = createJwt(
      { userId: user._id, userEmail: user.email },
      process.env.REFRESH_SEGNATURE as string,
      {
        expiresIn: "7d",
        jwtid: createOtp(),
      }
    );
    return successHandlerGraphQL({
      message: "User created successfully",
      result: { accessToken, refreshToken },
    });
  };
}

export const authResolves = new AuthResolves();
