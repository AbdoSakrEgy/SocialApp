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
const friendRequest_repo_1 = require("../../DB/repos/friendRequest.repo");
const createS3WriteStreamPipe = (0, util_1.promisify)(stream_1.pipeline);
class UserServices {
    userModel = new user_repo_1.UserRepo();
    friendRequestModel = new friendRequest_repo_1.FriendRequestRepo();
    constructor() { }
    // ============================ userProfile ============================
    userProfile = async (req, res, next) => {
        const userId = req.params?.userId;
        // step: if userId existence
        if (!userId) {
            return (0, successHandler_1.successHandler)({ res, result: res.locals.user });
        }
        // step: check user existence
        const user = await this.userModel.findOne({ filter: { _id: userId } });
        if (!user) {
            throw new Errors_1.ApplicationExpection("User not found", 404);
        }
        return (0, successHandler_1.successHandler)({ res, result: user });
    };
    // ============================ uploadProfileImage ============================
    uploadProfileImage = async (req, res, next) => {
        const user = res.locals.user;
        // step: upload image
        const Key = await (0, S3_services_1.uploadSingleSmallFileS3)({
            dest: `users/${user._id}/profileImage`,
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
            dest: `users/${user._id}/profileVideo`,
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
        const { url, Key } = await (0, S3_services_1.createPreSignedUrlToUploadFileS3)({
            dest: `users/${user._id}/avatarImage`,
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
        console.log(req.body);
        const user = res.locals.user;
        // step: upload images
        const Keys = await (0, S3_services_1.uploadMultiFilesS3)({
            filesFromMulter: req.files,
            dest: `users/${user._id}/coverImages`,
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
    // ============================ getFile ============================
    getFile = async (req, res, next) => {
        const { downloadName } = req.query;
        const path = req.params.path;
        const Key = path.join("/");
        const fileObject = await (0, S3_services_1.getFileS3)({ Key });
        if (!fileObject?.Body) {
            throw new Errors_1.ApplicationExpection("Failed to get file", 400);
        }
        res.setHeader("Content-Type", `${fileObject.ContentType}` || "application/octet-stream");
        if (downloadName) {
            res.setHeader("Content-Disposition", `attachment; filename=${downloadName}`);
        }
        return await createS3WriteStreamPipe(fileObject.Body, res);
    };
    // ============================ createPresignedUrlToGetFile ============================
    createPresignedUrlToGetFile = async (req, res, next) => {
        const { download = false, downloadName = "dumy", } = req.body;
        const path = req.params.path;
        const Key = path.join("/");
        const url = await (0, S3_services_1.createPresignedUrlToGetFileS3)({
            Key,
            download,
            downloadName,
        });
        return (0, successHandler_1.successHandler)({
            res,
            message: "Use this URL to get file",
            result: { url },
        });
    };
    // ============================ deleteFile ============================
    deleteFile = async (req, res, next) => {
        const path = req.params.path;
        const Key = path.join("/");
        const result = await (0, S3_services_1.deleteFileS3)({ Key });
        return (0, successHandler_1.successHandler)({
            res,
            message: "File deleted successfully",
        });
    };
    // ============================ deleteMultiFiles ============================
    deleteMultiFiles = async (req, res, next) => {
        const { Keys, Quiet = false } = req.body;
        const result = await (0, S3_services_1.deleteMultiFilesS3)({ Keys, Quiet });
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
    // ============================ sendFriendRequest ============================
    sendFriendRequest = async (req, res, next) => {
        const user = res.locals.user;
        const { to } = req.params;
        // step: check user not send for himself
        if (user._id == to) {
            throw new Errors_1.ApplicationExpection("You can't send friend request for your self", 400);
        }
        // step: check to existence
        const friend = await this.userModel.findOne({ filter: { _id: to } });
        if (!friend) {
            throw new Errors_1.ApplicationExpection("User not found", 404);
        }
        // step: check if friend req existence
        const isFriendRequestexistence = await this.friendRequestModel.findOne({
            filter: {
                $or: [
                    { from: user._id, to },
                    { from: to, to: user._id },
                ],
            },
        });
        if (isFriendRequestexistence) {
            throw new Errors_1.ApplicationExpection("There is already a friend request.", 400);
        }
        // step: create friend request
        const friendReq = await this.friendRequestModel.create({
            data: {
                from: user._id,
                to,
            },
        });
        return (0, successHandler_1.successHandler)({
            res,
            message: "Friend request sended successfully",
            result: { friendReq },
        });
    };
    // ============================ accepetFriendRequest ============================
    accepetFriendRequest = async (req, res, next) => {
        const user = res.locals.user;
        const friendRequestId = req.params
            .friendRequestId;
        // step: check friend request existence
        const friendRequest = await this.friendRequestModel.findOne({
            filter: {
                _id: friendRequestId,
                to: user._id,
                acceptedAt: { $exists: false },
            },
        });
        if (!friendRequest) {
            throw new Errors_1.ApplicationExpection("Friend request not found", 404);
        }
        // step: accept friend request
        await friendRequest.updateOne({
            $set: { acceptedAt: new Date(Date.now()) },
        });
        // step: add (user) to (friend friends list) and add (friend) to (user friends list)
        await this.userModel.findOneAndUpdate({
            filter: { _id: user._id },
            data: { $push: { friends: friendRequest.from } },
        });
        await this.userModel.findOneAndUpdate({
            filter: { _id: friendRequest.from },
            data: { $push: { friends: user._id } },
        });
        return (0, successHandler_1.successHandler)({
            res,
            message: "Friend request accepted successfully",
        });
    };
    // ============================ deleteFriendRequest ============================
    deleteFriendRequest = async (req, res, next) => {
        const user = res.locals.user;
        const { friendRequestId } = req.params;
        // step: check friendRequest existence
        const friendRequest = await this.friendRequestModel.findOne({
            filter: { _id: friendRequestId },
        });
        if (!friendRequest) {
            throw new Errors_1.ApplicationExpection("Friend request not found", 404);
        }
        // step: check auth
        if (!user._id.equals(friendRequest.from) ||
            user._id.equals(friendRequest.to)) {
            throw new Errors_1.ApplicationExpection("You are not authorized to delete this friend request", 401);
        }
        // step: check if friends
        if (friendRequest?.acceptedAt) {
            //-> step: delete both users from friends
            await this.userModel.findOneAndUpdate({
                filter: { _id: friendRequest.from },
                data: { $pull: { friends: friendRequest.to } },
            });
            await this.userModel.findOneAndUpdate({
                filter: { _id: friendRequest.to },
                data: { $pull: { friends: friendRequest.from } },
            });
            //-> step: delete friend request
            await this.friendRequestModel.findOneAndDelete({
                filter: { _id: friendRequestId },
            });
        }
        return (0, successHandler_1.successHandler)({
            res,
            message: "Friend request deleted successfully",
        });
    };
    // ============================ blockUser ============================
    blockUser = async (req, res, next) => {
        const user = res.locals.user;
        const { blockedUser } = req.body;
        // step: reject block himself
        if (user._id.equals(blockedUser)) {
            throw new Errors_1.ApplicationExpection("You can't block your self", 400);
        }
        // step: add blockedUser to blockList
        const updatedUser = await this.userModel.findOneAndUpdate({
            filter: { _id: user._id },
            data: { $push: { blockList: blockedUser } },
        });
        return (0, successHandler_1.successHandler)({ res, message: "User blocked successfully" });
    };
    // ============================ unBlockUser ============================
    unBlockUser = async (req, res, next) => {
        const user = res.locals.user;
        const { blockedUser } = req.body;
        // step: add blockedUser to blockList
        const updatedUser = await this.userModel.findOneAndUpdate({
            filter: { _id: user._id },
            data: { $pull: { blockList: blockedUser } },
        });
        return (0, successHandler_1.successHandler)({ res, message: "User unBlocked successfully" });
    };
}
exports.UserServices = UserServices;
