"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const user_service_1 = require("./user.service");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const user_validation_1 = require("./user.validation");
const userServices = new user_service_1.UserServices();
router.get("/user-profile", auth_middleware_1.auth, userServices.userProfile);
// router.post(
//   "/local-upload-profile-image",
//   auth,
//   multer_localUpload({}).single("image"),
//   userServices.localUploadProfileImage
// );
router.patch("/update-basic-info", auth_middleware_1.auth, (0, validation_middleware_1.validation)(user_validation_1.updateBasicInfoSchema), userServices.updateBasicInfo);
exports.default = router;
