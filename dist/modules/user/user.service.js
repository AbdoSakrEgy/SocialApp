"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const user_model_1 = require("./user.model");
const Errors_1 = require("../../utils/Errors");
const db_repo_1 = require("../../DB/db.repo");
const sendEmail_1 = require("../../utils/sendEmail/sendEmail");
const generateHTML_1 = require("../../utils/sendEmail/generateHTML");
const successHandler_1 = require("../../utils/successHandler");
const bcrypt_1 = require("../../utils/bcrypt");
class UserServices {
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
        const otpCode = "555";
        const { isEmailSended, info } = await (0, sendEmail_1.sendEmail)({
            to: email,
            subject: "ECommerceApp",
            html: (0, generateHTML_1.template)({
                otpCode,
                receiverName: firstName,
                subject: "Confirm email",
            }),
        });
        if (!isEmailSended) {
            return (0, successHandler_1.successHandler)({
                res,
                message: "Error while checking email",
                status: 400,
            });
        }
        if (!isEmailSended) {
            throw new Errors_1.ApplicationExpection("Error while sending email", 400);
        }
        // step: create new user
        const user = await this.userModel.create({
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
            throw new Errors_1.ApplicationExpection("Creation failed", 500);
        }
        return (0, successHandler_1.successHandler)({ res, message: "User created successfully" });
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
}
exports.UserServices = UserServices;
