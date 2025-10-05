import { Router } from "express";
const router = Router();
import { UserServices } from "./user.service";
import { auth } from "../../middlewares/auth.middleware";
import { multer_localUpload } from "../../utils/multer/multer.local";
import { UserModel } from "./user.model";
import { UserRepo } from "./user.repo";
import { validation } from "../../middlewares/validation.middleware";
import { updateBasicInfoSchema } from "./user.validation";

const userServices = new UserServices();

router.get("/user-profile", auth, userServices.userProfile);
// router.post(
//   "/local-upload-profile-image",
//   auth,
//   multer_localUpload({}).single("image"),
//   userServices.localUploadProfileImage
// );
router.patch(
  "/update-basic-info",
  auth,
  validation(updateBasicInfoSchema),
  userServices.updateBasicInfo
);

export default router;
