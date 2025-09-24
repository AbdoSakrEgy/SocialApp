"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const db_repo_1 = require("../../DB/db.repo");
const user_model_1 = require("../user/user.model");
const Errors_1 = require("../../utils/Errors");
const email_events_1 = require("../../utils/sendEmail/email.events");
const generateHTML_1 = require("../../utils/sendEmail/generateHTML");
const jwt_1 = require("../../utils/jwt");
const successHandler_1 = require("../../utils/successHandler");
const bcrypt_1 = require("../../utils/bcrypt");
class AuthServices {
    userModel = new db_repo_1.DBRepo(user_model_1.UserModel);
    // private userModel = new UserRepo();
    constructor() { }
    // register
    register = async (req, res, next) => {
        const { firstName, lastName, email, password } = req.body;
        // step: check user existance
        const isUserExist = await this.userModel.findOne({
            filter: { email },
            options: { lean: true },
        });
        if (isUserExist) {
            throw new Errors_1.NotValidEmail("User already exist");
        }
        // step: send otp to email
        //! const otpCode = createOtp();
        //! why user.repo
        //! why emmeters in sendEmail.js
        const otpCode = "555";
        email_events_1.emailEvent.emit("sendEmail", {
            to: email,
            subject: "ECommerceApp",
            html: (0, generateHTML_1.template)({
                otpCode,
                receiverName: firstName,
                subject: "Confirm email",
            }),
        });
        // step: create new user
        const user = await this.userModel.create({
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
            throw new Errors_1.ApplicationExpection("Creation failed", 500);
        }
        // step: create token
        const accessToken = (0, jwt_1.createJwt)({ id: user._id, email: user.email }, process.env.ACCESS_SEGNATURE, {
            expiresIn: "1h",
            //! jwtid:createOtp()
            jwtid: "555",
        });
        const refreshToken = (0, jwt_1.createJwt)({ id: user._id, email: user.email }, process.env.REFRESH_SEGNATURE, {
            expiresIn: "7d",
            //! jwtid:createOtp()
            jwtid: "555",
        });
        return (0, successHandler_1.successHandler)({
            res,
            message: "User created successfully",
            result: { accessToken, refreshToken },
        });
    };
    // login
    login = async (req, res, next) => {
        const { email, password } = req.body;
        // step: check credentials
        const isUserExist = await this.userModel.findOne({ filter: { email } });
        if (!isUserExist) {
            throw new Errors_1.ApplicationExpection("Invalid credentials", 404);
        }
        const user = isUserExist;
        if (!(0, bcrypt_1.compare)(password, user.password)) {
            throw new Errors_1.ApplicationExpection("Invalid credentials", 401);
        }
        // step: create token
        const accessToken = (0, jwt_1.createJwt)({ id: user._id, email: user.email }, process.env.ACCESS_SEGNATURE, {
            expiresIn: "1h",
            //! jwtid:createOtp()
            jwtid: "555",
        });
        const refreshToken = (0, jwt_1.createJwt)({ id: user._id, email: user.email }, process.env.REFRESH_SEGNATURE, {
            expiresIn: "7d",
            //! jwtid:createOtp()
            jwtid: "555",
        });
        return (0, successHandler_1.successHandler)({
            res,
            message: "Loggedin successfully",
            result: { accessToken, refreshToken },
        });
    };
    // confirmEmail
    confirmEmail = async (req, res, next) => {
        const { email, firstOtp, secondOtp } = req.body;
        // step: check user exitance
        const user = await this.userModel.findOne({ filter: { email } });
        if (!user) {
            throw new Errors_1.ApplicationExpection("User not found", 400);
        }
        // step: check emailOtp
        if (!(await (0, bcrypt_1.compare)(firstOtp, user.emailOtp.otp))) {
            return (0, successHandler_1.successHandler)({ res, message: "Invalid otp", status: 400 });
        }
        if (user.emailOtp.expiresIn < new Date(Date.now())) {
            return (0, successHandler_1.successHandler)({ res, message: "otp expired", status: 400 });
        }
        // step: case 1 email not confrimed (confirm first email)
        if (!user.emailConfirmed) {
            // step: confirm email
            const updatedUser = await this.userModel.findOneAndUpdate({
                filter: { email: user.email },
                data: { $set: { emailConfirmed: true } },
            });
            return (0, successHandler_1.successHandler)({ res, message: "Email confirmed successfully" });
        }
        // step: case 2 email confrimed (confirm first and second email)
        // step: check secondOtp existance
        if (!secondOtp) {
            return (0, successHandler_1.successHandler)({
                res,
                message: "Email already confirmed, if you want to update email please send firstOtp and secondOtp",
                status: 400,
            });
        }
        // step: check newEmailOtp
        if (!(await (0, bcrypt_1.compare)(secondOtp, user.newEmailOtp.otp))) {
            return (0, successHandler_1.successHandler)({
                res,
                message: "Invalid otp for second email",
                status: 400,
            });
        }
        if (user.newEmailOtp.expiresIn < new Date(Date.now())) {
            return (0, successHandler_1.successHandler)({
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
        return (0, successHandler_1.successHandler)({
            res,
            message: "New email confirmed successfully",
        });
    };
    // resendEmailOtp
    resendEmailOtp = async (req, res, next) => {
        const { email } = req.body;
        // step: check email existance
        const isUserExist = await this.userModel.findOne({ filter: { email } });
        if (!isUserExist) {
            throw new Errors_1.ApplicationExpection("User not found", 404);
        }
        const user = isUserExist;
        // step: check if email otp not expired yet
        if (user.emailOtp?.expiresIn > new Date(Date.now())) {
            throw new Errors_1.ApplicationExpection("Your OTP not expired yet", 400);
        }
        // step: send otp to email
        //! const otpCode = createOtp();
        const otpCode = "555";
        email_events_1.emailEvent.emit("sendEmail", {
            to: email,
            subject: "ECommerceApp",
            html: (0, generateHTML_1.template)({
                otpCode,
                receiverName: user.firstName,
                subject: "Confirm email",
            }),
        });
        // step: update emailOtp
        const updatedUset = await this.userModel.findOneAndUpdate({
            filter: { email: user.email },
            data: {
                $set: {
                    emailOtp: {
                        otp: otpCode,
                        expiresIn: new Date(Date.now() + 5 * 60 * 1000),
                    },
                },
            },
        });
        return (0, successHandler_1.successHandler)({ res, message: "OTP sended successfully" });
    };
}
exports.AuthServices = AuthServices;
