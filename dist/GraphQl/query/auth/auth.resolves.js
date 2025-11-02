"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authResolves = void 0;
const user_repo_1 = require("../../../modules/user/user.repo");
const createOtp_1 = require("../../../utils/createOtp");
const generateHTML_1 = require("../../../utils/sendEmail/generateHTML");
const send_email_1 = require("../../../utils/sendEmail/send.email");
const jwt_1 = require("../../../utils/jwt");
const successHandler_1 = require("../../../utils/successHandler");
const graphql_1 = require("graphql");
class AuthResolves {
    userRepo = new user_repo_1.UserRepo();
    signup = async (parent, args, context, info1) => {
        const { firstName, lastName, email, password } = args;
        // step: check user existence
        const isUserExist = await this.userRepo.findOne({
            filter: { email },
            options: { lean: true },
        });
        if (isUserExist) {
            throw new graphql_1.GraphQLError("User already exist", {
                extensions: {
                    status: 400,
                },
            });
        }
        // step: send email otp
        const otpCode = (0, createOtp_1.createOtp)();
        const { isEmailSended, info } = await (0, send_email_1.sendEmail)({
            to: email,
            subject: "SocialApp",
            html: (0, generateHTML_1.template)({
                otpCode,
                receiverName: firstName,
                subject: "Confirm email",
            }),
        });
        if (!isEmailSended) {
            throw new graphql_1.GraphQLError("Error while sending email", {
                extensions: { status: 400 },
            });
        }
        // step: create new user
        const user = await this.userRepo.create({
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
            throw new graphql_1.GraphQLError("Creation failed", {
                extensions: { status: 500 },
            });
        }
        // step: create token
        const accessToken = (0, jwt_1.createJwt)({ userId: user._id, userEmail: user.email }, process.env.ACCESS_SEGNATURE, {
            expiresIn: "1h",
            jwtid: (0, createOtp_1.createOtp)(),
        });
        const refreshToken = (0, jwt_1.createJwt)({ userId: user._id, userEmail: user.email }, process.env.REFRESH_SEGNATURE, {
            expiresIn: "7d",
            jwtid: (0, createOtp_1.createOtp)(),
        });
        return (0, successHandler_1.successHandlerGraphQL)({
            message: "User created successfully",
            result: { accessToken, refreshToken },
        });
    };
}
exports.authResolves = new AuthResolves();
