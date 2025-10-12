import { Router } from "express";
const router = Router();
import { UserServices } from "./user.service";
import { auth } from "../../middlewares/auth.middleware";
import { UserModel } from "./user.model";
import { UserRepo } from "./user.repo";
import { validation } from "../../middlewares/validation.middleware";
import {
  deleteMultiFilesSchema,
  createPresignedUrlToGetFileSchema,
  updateBasicInfoSchema,
  uploadAvatarImageSchema,
} from "./user.validation";
import {
  fileTypes,
  multerUpload,
  StoreIn,
} from "../../utils/multer/multer.upload";
const userServices = new UserServices();

router.get("/user-profile", auth, userServices.userProfile);
router.patch(
  "/upload-profile-image",
  auth,
  multerUpload({}).single("profileImage"),
  userServices.uploadProfileImage
);
router.patch(
  "/upload-profile-video",
  auth,
  multerUpload({
    sendedFileType: fileTypes.video,
    storeIn: StoreIn.disk,
  }).single("profileVideo"),
  userServices.uploadProfileVideo
);
router.patch("/upload-avatar-image", auth, userServices.uploadAvatarImage);
router.patch(
  "/upload-cover-images",
  auth,
  validation(uploadAvatarImageSchema),
  multerUpload({}).array("coverImages", 3),
  userServices.uploadCoverImages
);
//! next api after use it from browser is generate => Error [ERR_HTTP_HEADERS_SENT]...
router.get("/get-file/*path", userServices.getFile);
router.get(
  "/create-presignedUrl-toGetFile/*path",
  validation(createPresignedUrlToGetFileSchema),
  userServices.createPresignedUrlToGetFile
);
router.delete("/delete-file/*path", userServices.deleteFile);
router.delete(
  "/delete-multi-files",
  validation(deleteMultiFilesSchema),
  userServices.deleteMultiFiles
);
router.patch(
  "/update-basic-info",
  auth,
  validation(updateBasicInfoSchema),
  userServices.updateBasicInfo
);

export default router;
