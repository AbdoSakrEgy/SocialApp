"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const user_service_1 = require("./user.service");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const user_validation_1 = require("./user.validation");
const multer_upload_1 = require("../../utils/multer/multer.upload");
const userServices = new user_service_1.UserServices();
router.get("/user-profile", auth_middleware_1.auth, userServices.userProfile);
router.patch("/upload-profile-image", auth_middleware_1.auth, (0, multer_upload_1.multerUpload)({}).single("profileImage"), (0, validation_middleware_1.validation)(user_validation_1.uploadProfileImageSchema), userServices.uploadProfileImage);
router.patch("/upload-profile-video", auth_middleware_1.auth, (0, multer_upload_1.multerUpload)({
    sendedFileType: multer_upload_1.fileTypes.video,
    storeIn: multer_upload_1.StoreIn.disk,
}).single("profileVideo"), (0, validation_middleware_1.validation)(user_validation_1.uploadProfileVideoSchema), userServices.uploadProfileVideo);
router.patch("/upload-avatar-image", auth_middleware_1.auth, (0, validation_middleware_1.validation)(user_validation_1.uploadAvatarImageSchema), userServices.uploadAvatarImage);
router.patch("/upload-cover-images", auth_middleware_1.auth, (0, multer_upload_1.multerUpload)({}).array("coverImages", 3), 
//! not working
// validation(uploadCoverImagesSchema),
userServices.uploadCoverImages);
//! next api after use it from browser is generate => Error [ERR_HTTP_HEADERS_SENT]...
router.get("/get-file/*path", userServices.getFile);
router.get("/create-presignedUrl-toGetFile/*path", (0, validation_middleware_1.validation)(user_validation_1.createPresignedUrlToGetFileSchema), userServices.createPresignedUrlToGetFile);
router.delete("/delete-file/*path", userServices.deleteFile);
router.delete("/delete-multi-files", (0, validation_middleware_1.validation)(user_validation_1.deleteMultiFilesSchema), userServices.deleteMultiFiles);
router.patch("/update-basic-info", auth_middleware_1.auth, (0, validation_middleware_1.validation)(user_validation_1.updateBasicInfoSchema), userServices.updateBasicInfo);
router.post("/send-friend-request/:to", auth_middleware_1.auth, (0, validation_middleware_1.validation)(user_validation_1.sendFriendRequestSchema), userServices.sendFriendRequest);
router.post("/accept-friend-request/:friendRequestId", auth_middleware_1.auth, (0, validation_middleware_1.validation)(user_validation_1.acceptFriendRequestSchema), userServices.accepetFriendRequest);
router.delete("/delete-friend-request/:friendRequestId", auth_middleware_1.auth, (0, validation_middleware_1.validation)(user_validation_1.deleteFriendRequestSchema), userServices.deleteFriendRequest);
router.post("/block-user", auth_middleware_1.auth, (0, validation_middleware_1.validation)(user_validation_1.blockUserSchema), userServices.blockUser);
router.post("/unblock-user", auth_middleware_1.auth, (0, validation_middleware_1.validation)(user_validation_1.blockUserSchema), userServices.unBlockUser);
exports.default = router;
