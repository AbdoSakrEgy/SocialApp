import { Router } from "express";
const router = Router();
import { UserServices } from "./user.service";
import { auth } from "../../middlewares/auth.middleware";
import { UserModel } from "./user.model";
import { UserRepo } from "./user.repo";
import { validation } from "../../middlewares/validation.middleware";
import { updateBasicInfoSchema } from "./user.validation";
import { multerUpload } from "../../utils/multer/multer.upload";
const userServices = new UserServices();

router.get("/user-profile", auth, userServices.userProfile);
router.post(
  "/upload-profile-image",
  auth,
  multerUpload({}).single("image"),
  userServices.uploadProfileImage
);
router.patch(
  "/update-basic-info",
  auth,
  validation(updateBasicInfoSchema),
  userServices.updateBasicInfo
);

export default router;
