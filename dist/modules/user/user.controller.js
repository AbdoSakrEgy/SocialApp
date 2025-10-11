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
router.patch("/upload-profile-image", auth_middleware_1.auth, (0, multer_upload_1.multerUpload)({}).single("profileImage"), userServices.uploadProfileImage);
router.patch("/upload-profile-video", auth_middleware_1.auth, (0, multer_upload_1.multerUpload)({
    sendedFileType: multer_upload_1.fileTypes.video,
    storeIn: multer_upload_1.StoreIn.disk,
}).single("profileVideo"), userServices.uploadProfileVideo);
router.patch("/upload-avatar-image", auth_middleware_1.auth, userServices.uploadAvatarImage);
router.patch("/upload-cover-images", auth_middleware_1.auth, (0, validation_middleware_1.validation)(user_validation_1.uploadAvatarImageSchema), (0, multer_upload_1.multerUpload)({}).array("coverImages", 3), userServices.uploadCoverImages);
//! next api after use it from browser is generate => Error [ERR_HTTP_HEADERS_SENT]...
router.get("/get-file-from-key/*path", userServices.getFileFromKey);
router.get("/get-file-from-key-preSignedURL/*path", (0, validation_middleware_1.validation)(user_validation_1.getFileFromKeyPreSignedURLSchema), userServices.getFileFromKeyPreSignedURL);
router.delete("/delete-file-using-key/*path", userServices.deleteFileUsingKey);
router.delete("/delete-files-using-key", (0, validation_middleware_1.validation)(user_validation_1.deleteFilesUsingKeySchema), userServices.deleteFilesUsingKey);
router.patch("/update-basic-info", auth_middleware_1.auth, (0, validation_middleware_1.validation)(user_validation_1.updateBasicInfoSchema), userServices.updateBasicInfo);
exports.default = router;
