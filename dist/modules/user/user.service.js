"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const successHandler_1 = require("../../utils/successHandler");
const user_repo_1 = require("./user.repo");
const S3_services_1 = require("../../utils/multer/S3.services");
class UserServices {
    // private userModel = new DBRepo(UserModel);
    userModel = new user_repo_1.UserRepo();
    constructor() { }
    // ============================ userProfile ============================
    userProfile = async (req, res, next) => {
        const user = res.locals.user;
        return (0, successHandler_1.successHandler)({ res, result: user });
    };
    // ============================ uploadProfileImage ============================
    uploadProfileImage = async (req, res, next) => {
        const user = res.locals.user;
        // step: upload image
        const path = await (0, S3_services_1.uploadSingleFileS3)({
            file: req.file,
            path: "ProfileImages",
        });
        // step: update user
        const updatedUser = await this.userModel.findOneAndUpdate({
            filter: { _id: user._id },
            data: { $set: { profileImage: path } },
        });
        return (0, successHandler_1.successHandler)({
            res,
            message: "Image uploaded successfully",
            result: { path },
        });
    };
    // ============================ uploadCoverImages ============================
    uploadCoverImages = async (req, res, next) => {
        const user = res.locals.user;
        // step: upload images
        const pathes = await (0, S3_services_1.uploadMultiFilesS3)({
            files: req.files,
            path: "CoverImages",
        });
        // step: update user
        const updatedUser = await this.userModel.findOneAndUpdate({
            filter: { _id: user._id },
            data: { $set: { coverImages: pathes } },
        });
        return (0, successHandler_1.successHandler)({
            res,
            message: "Image uploaded successfully",
            result: { pathes },
        });
    };
    // ============================ updateBasicInfo ============================
    updateBasicInfo = async (req, res, next) => {
        const user = res.locals.user;
        const { firstName, lastName, age, gender, phone } = req.body;
        // step: update basic info
        const updatedUser = await this.userModel.findOneAndUpdate({
            filter: { _id: user._id },
            data: { $set: { firstName, lastName, age, gender, phone } },
        });
        if (!updatedUser) {
            return (0, successHandler_1.successHandler)({
                res,
                message: "Error while update user",
                status: 500,
            });
        }
        return (0, successHandler_1.successHandler)({ res, message: "User updated successfully" });
    };
}
exports.UserServices = UserServices;
