"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const successHandler_1 = require("../../utils/successHandler");
const user_repo_1 = require("./user.repo");
class UserServices {
    // private userModel = new DBRepo(UserModel);
    userModel = new user_repo_1.UserRepo();
    constructor() { }
    // ============================ userProfile ============================
    userProfile = async (req, res, next) => {
        const user = res.locals.user;
        return (0, successHandler_1.successHandler)({ res, result: user });
    };
    // ============================ localUploadProfileImage ============================
    // localUploadProfileImage = async (
    //   req: Request,
    //   res: Response,
    //   next: NextFunction
    // ): Promise<Response> => {
    //   return successHandler({ res, result: { file: req.file } });
    // };
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
