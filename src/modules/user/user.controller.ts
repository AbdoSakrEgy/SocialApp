import { Router } from "express";
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
  uploadProfileImageSchema,
  uploadProfileVideoSchema,
  uploadCoverImagesSchema,
  sendFriendRequestSchema,
  acceptFriendRequestSchema,
  blockUserSchema,
  deleteFriendRequestSchema,
} from "./user.validation";
import {
  fileTypes,
  multerUpload,
  StoreIn,
} from "../../utils/multer/multer.upload";
const router = Router();
const userServices = new UserServices();

router.get("/user-profile", auth, userServices.userProfile);
router.get("/user-profile/:userId", auth, userServices.userProfile);
router.patch(
  "/upload-profile-image",
  auth,
  multerUpload({}).single("profileImage"),
  validation(uploadProfileImageSchema),
  userServices.uploadProfileImage
);
router.patch(
  "/upload-profile-video",
  auth,
  multerUpload({
    sendedFileType: fileTypes.video,
    storeIn: StoreIn.disk,
  }).single("profileVideo"),
  validation(uploadProfileVideoSchema),
  userServices.uploadProfileVideo
);
router.patch(
  "/upload-avatar-image",
  auth,
  validation(uploadAvatarImageSchema),
  userServices.uploadAvatarImage
);
router.patch(
  "/upload-cover-images",
  auth,
  multerUpload({}).array("coverImages", 3),
  //! not working
  // validation(uploadCoverImagesSchema),
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
router.post(
  "/send-friend-request/:to",
  auth,
  validation(sendFriendRequestSchema),
  userServices.sendFriendRequest
);
router.post(
  "/accept-friend-request/:friendRequestId",
  auth,
  validation(acceptFriendRequestSchema),
  userServices.accepetFriendRequest
);
router.delete(
  "/delete-friend-request/:friendRequestId",
  auth,
  validation(deleteFriendRequestSchema),
  userServices.deleteFriendRequest
);
router.post(
  "/block-user",
  auth,
  validation(blockUserSchema),
  userServices.blockUser
);

router.post(
  "/unblock-user",
  auth,
  validation(blockUserSchema),
  userServices.unBlockUser
);

export default router;
