import { IUser, UserModel } from "./user.model";
import { DBRepo } from "../../DB/db.repo";
import { successHandler } from "../../utils/successHandler";
import { NextFunction, Request, Response } from "express";
import { UserRepo } from "./user.repo";
import {
  deleteFilesUsingKeyDTO,
  getFileFromKeyPreSignedURLDTO,
  updateBasicInfoDTO,
  uploadAvatarImageDTO,
} from "./user.dto";
import {
  createPreSignedURLS3,
  uploadMultiFilesS3,
  uploadSingleSmallFileS3,
  uploadSingleLargeFileS3,
  getS3File,
  createGetPreSignedURLS3,
  deleteS3File,
  deleteS3Files,
} from "../../utils/multer/S3.services";
import { HydratedDocument } from "mongoose";
import { StoreIn } from "../../utils/multer/multer.upload";
import { ApplicationExpection } from "../../utils/Errors";
import { promisify } from "util";
import { pipeline } from "stream";
const createS3WriteStreamPipe = promisify(pipeline);
interface IUserServices {}

export class UserServices implements IUserServices {
  // private userModel = new DBRepo(UserModel);
  private userModel = new UserRepo();

  constructor() {}

  // ============================ userProfile ============================
  userProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user;
    return successHandler({ res, result: user });
  };

  // ============================ uploadProfileImage ============================
  uploadProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user as HydratedDocument<IUser>;
    // step: upload image
    const Key = await uploadSingleSmallFileS3({
      dest: `${user.firstName}/profileImage`,
      fileFromMulter: req.file as Express.Multer.File,
    });
    // step: update user
    const updatedUser = await this.userModel.findOneAndUpdate({
      filter: { _id: user._id },
      data: { $set: { profileImage: Key } },
    });
    return successHandler({
      res,
      message: "Profile image uploaded successfully",
      result: { Key },
    });
  };

  // ============================ uploadProfileVideo ============================
  uploadProfileVideo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user as HydratedDocument<IUser>;
    // step: upload video
    const Key = await uploadSingleLargeFileS3({
      dest: `${user.firstName}/profileVideo`,
      fileFromMulter: req.file as Express.Multer.File,
      storeIn: StoreIn.disk,
    });
    // step: update user
    const updatedUser = await this.userModel.findOneAndUpdate({
      filter: { _id: user._id },
      data: { $set: { profileVideo: Key } },
    });
    return successHandler({
      res,
      message: "Profile video uploaded successfully",
      result: { Key },
    });
  };

  // ============================ uploadAvatarImage ============================
  uploadAvatarImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user as HydratedDocument<IUser>;
    const { fileName, fileType }: uploadAvatarImageDTO = req.body;
    // step: upload image
    const { url, Key } = await createPreSignedURLS3({
      dest: `${user.firstName}/avatarImage`,
      fileName,
      ContentType: fileType,
    });
    // step: update user
    const updatedUser = await this.userModel.findOneAndUpdate({
      filter: { _id: user._id },
      data: { $set: { avatarImage: Key } },
    });
    return successHandler({
      res,
      message:
        "Use url to upload your image by using it as API with PUT method",
      result: { url, Key },
    });
  };

  // ============================ uploadCoverImages ============================
  uploadCoverImages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user;
    // step: upload images
    const Keys = await uploadMultiFilesS3({
      filesFromMulter: req.files as Express.Multer.File[],
      dest: `${user.firstName}/coverImages`,
    });
    // step: update user
    const updatedUser = await this.userModel.findOneAndUpdate({
      filter: { _id: user._id },
      data: { $set: { coverImages: Keys } },
    });
    return successHandler({
      res,
      message: "Cover images uploaded successfully",
      result: { Keys },
    });
  };

  // ============================ getFileFromKey ============================
  getFileFromKey = async (req: Request, res: Response, next: NextFunction) => {
    const { downloadName } = req.query;
    const path = req.params.path as unknown as string[];
    const Key = path.join("/");
    const s3response = await getS3File({ Key });
    if (!s3response?.Body) {
      throw new ApplicationExpection("Failed to get assets", 400);
    }
    res.setHeader(
      "Content-Type",
      `${s3response.ContentType}` || "application/octet-stream"
    );
    if (downloadName) {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${downloadName}`
      );
    }
    return await createS3WriteStreamPipe(
      s3response.Body as NodeJS.ReadableStream,
      res
    );
  };

  // ============================ getFileFromKeyPreSignedURL ============================
  getFileFromKeyPreSignedURL = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { download, downloadName }: getFileFromKeyPreSignedURLDTO = req.body;
    const path = req.params.path as unknown as string[];
    const Key = path.join("/");
    const url = await createGetPreSignedURLS3({ Key, download, downloadName });
    return successHandler({ res, message: "URL of file", result: { url } });
  };

  // ============================ deleteFileUsingKey ============================
  deleteFileUsingKey = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const path = req.params.path as unknown as string[];
    const Key = path.join("/");
    const result = await deleteS3File({ Key });
    return successHandler({
      res,
      message: "File deleted successfully",
    });
  };
  // ============================ deleteFilesUsingKey ============================
  deleteFilesUsingKey = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { Keys, Quiet = false }: deleteFilesUsingKeyDTO = req.body;
    const result = await deleteS3Files({ Keys, Quiet });
    return successHandler({
      res,
      message: "Files deleted successfully",
    });
  };

  // ============================ updateBasicInfo ============================
  updateBasicInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user;
    const { firstName, lastName, age, gender, phone }: updateBasicInfoDTO =
      req.body;
    // step: update basic info
    const updatedUser = await this.userModel.findOneAndUpdate({
      filter: { _id: user._id },
      data: { $set: { firstName, lastName, age, gender, phone } },
    });
    if (!updatedUser) {
      return successHandler({
        res,
        message: "Error while update user",
        status: 500,
      });
    }
    return successHandler({ res, message: "User updated successfully" });
  };
}
