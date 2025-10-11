"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const successHandler_1 = require("../../utils/successHandler");
const user_repo_1 = require("./user.repo");
const S3_services_1 = require("../../utils/multer/S3.services");
const multer_upload_1 = require("../../utils/multer/multer.upload");
const Errors_1 = require("../../utils/Errors");
const util_1 = require("util");
const stream_1 = require("stream");
const createS3WriteStreamPipe = (0, util_1.promisify)(stream_1.pipeline);
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
        const Key = await (0, S3_services_1.uploadSingleSmallFileS3)({
            dest: `${user.firstName}/profileImage`,
            fileFromMulter: req.file,
        });
        // step: update user
        const updatedUser = await this.userModel.findOneAndUpdate({
            filter: { _id: user._id },
            data: { $set: { profileImage: Key } },
        });
        return (0, successHandler_1.successHandler)({
            res,
            message: "Profile image uploaded successfully",
            result: { Key },
        });
    };
    // ============================ uploadProfileVideo ============================
    uploadProfileVideo = async (req, res, next) => {
        const user = res.locals.user;
        // step: upload video
        const Key = await (0, S3_services_1.uploadSingleLargeFileS3)({
            dest: `${user.firstName}/profileVideo`,
            fileFromMulter: req.file,
            storeIn: multer_upload_1.StoreIn.disk,
        });
        // step: update user
        const updatedUser = await this.userModel.findOneAndUpdate({
            filter: { _id: user._id },
            data: { $set: { profileVideo: Key } },
        });
        return (0, successHandler_1.successHandler)({
            res,
            message: "Profile video uploaded successfully",
            result: { Key },
        });
    };
    // ============================ uploadAvatarImage ============================
    uploadAvatarImage = async (req, res, next) => {
        const user = res.locals.user;
        const { fileName, fileType } = req.body;
        // step: upload image
        const { url, Key } = await (0, S3_services_1.createPreSignedURLS3)({
            dest: `${user.firstName}/avatarImage`,
            fileName,
            ContentType: fileType,
        });
        // step: update user
        const updatedUser = await this.userModel.findOneAndUpdate({
            filter: { _id: user._id },
            data: { $set: { avatarImage: Key } },
        });
        return (0, successHandler_1.successHandler)({
            res,
            message: "Use url to upload your image by using it as API with PUT method",
            result: { url, Key },
        });
    };
    // ============================ uploadCoverImages ============================
    uploadCoverImages = async (req, res, next) => {
        const user = res.locals.user;
        // step: upload images
        const Keys = await (0, S3_services_1.uploadMultiFilesS3)({
            filesFromMulter: req.files,
            dest: `${user.firstName}/coverImages`,
        });
        // step: update user
        const updatedUser = await this.userModel.findOneAndUpdate({
            filter: { _id: user._id },
            data: { $set: { coverImages: Keys } },
        });
        return (0, successHandler_1.successHandler)({
            res,
            message: "Cover images uploaded successfully",
            result: { Keys },
        });
    };
    // ============================ getFileFromKey ============================
    getFileFromKey = async (req, res, next) => {
        const { downloadName } = req.query;
        const path = req.params.path;
        const Key = path.join("/");
        const s3response = await (0, S3_services_1.getS3File)({ Key });
        if (!s3response?.Body) {
            throw new Errors_1.ApplicationExpection("Failed to get assets", 400);
        }
        res.setHeader("Content-Type", `${s3response.ContentType}` || "application/octet-stream");
        if (downloadName) {
            res.setHeader("Content-Disposition", `attachment; filename=${downloadName}`);
        }
        return await createS3WriteStreamPipe(s3response.Body, res);
    };
    // ============================ getFileFromKeyPreSignedURL ============================
    getFileFromKeyPreSignedURL = async (req, res, next) => {
        const { download, downloadName } = req.body;
        const path = req.params.path;
        const Key = path.join("/");
        const url = await (0, S3_services_1.createGetPreSignedURLS3)({ Key, download, downloadName });
        return (0, successHandler_1.successHandler)({ res, message: "URL of file", result: { url } });
    };
    // ============================ deleteFileUsingKey ============================
    deleteFileUsingKey = async (req, res, next) => {
        const path = req.params.path;
        const Key = path.join("/");
        const result = await (0, S3_services_1.deleteS3File)({ Key });
        return (0, successHandler_1.successHandler)({
            res,
            message: "File deleted successfully",
        });
    };
    // ============================ deleteFilesUsingKey ============================
    deleteFilesUsingKey = async (req, res, next) => {
        const { Keys, Quiet = false } = req.body;
        const result = await (0, S3_services_1.deleteS3Files)({ Keys, Quiet });
        return (0, successHandler_1.successHandler)({
            res,
            message: "Files deleted successfully",
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
