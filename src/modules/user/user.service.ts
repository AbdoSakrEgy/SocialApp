import { IUser } from "./user.model";
import { successHandler } from "../../utils/successHandler";
import { NextFunction, Request, Response } from "express";
import { UserRepo } from "./user.repo";
import {
  deleteMultiFilesDTO,
  createPresignedUrlToGetFileDTO,
  updateBasicInfoDTO,
  uploadAvatarImageDTO,
  sendFriendRequestDTO,
  acceptFriendRequestDTO,
} from "./user.dto";
import {
  createPreSignedUrlToUploadFileS3,
  uploadMultiFilesS3,
  uploadSingleSmallFileS3,
  uploadSingleLargeFileS3,
  getFileS3,
  createPresignedUrlToGetFileS3,
  deleteFileS3,
  deleteMultiFilesS3,
} from "../../utils/multer/S3.services";
import { HydratedDocument } from "mongoose";
import { StoreIn } from "../../utils/multer/multer.upload";
import { ApplicationExpection } from "../../utils/Errors";
import { promisify } from "util";
import { pipeline } from "stream";
import { FriendRequestRepo } from "../../DB/repos/friendRequest.repo";
const createS3WriteStreamPipe = promisify(pipeline);
interface IUserServices {
  userProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  uploadProfileImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  uploadProfileVideo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  uploadAvatarImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  uploadCoverImages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  getFile(req: Request, res: Response, next: NextFunction): Promise<void>;
  createPresignedUrlToGetFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  deleteFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  deleteMultiFiles(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  updateBasicInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  sendFriendRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
  accepetFriendRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
}

export class UserServices implements IUserServices {
  private userModel = new UserRepo();
  private friendRequestModel = new FriendRequestRepo();

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
      dest: `users/${user._id}/profileImage`,
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
      dest: `users/${user._id}/profileVideo`,
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
    const { url, Key } = await createPreSignedUrlToUploadFileS3({
      dest: `users/${user._id}/avatarImage`,
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
    console.log(req.body);
    const user = res.locals.user;
    // step: upload images
    const Keys = await uploadMultiFilesS3({
      filesFromMulter: req.files as Express.Multer.File[],
      dest: `users/${user._id}/coverImages`,
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

  // ============================ getFile ============================
  getFile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { downloadName } = req.query;
    const path = req.params.path as unknown as string[];
    const Key = path.join("/");
    const fileObject = await getFileS3({ Key });
    if (!fileObject?.Body) {
      throw new ApplicationExpection("Failed to get file", 400);
    }
    res.setHeader(
      "Content-Type",
      `${fileObject.ContentType}` || "application/octet-stream"
    );
    if (downloadName) {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${downloadName}`
      );
    }
    return await createS3WriteStreamPipe(
      fileObject.Body as NodeJS.ReadableStream,
      res
    );
  };

  // ============================ createPresignedUrlToGetFile ============================
  createPresignedUrlToGetFile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const {
      download = false,
      downloadName = "dumy",
    }: createPresignedUrlToGetFileDTO = req.body;
    const path = req.params.path as unknown as string[];
    const Key = path.join("/");
    const url = await createPresignedUrlToGetFileS3({
      Key,
      download,
      downloadName,
    });
    return successHandler({
      res,
      message: "Use this URL to get file",
      result: { url },
    });
  };

  // ============================ deleteFile ============================
  deleteFile = async (req: Request, res: Response, next: NextFunction) => {
    const path = req.params.path as unknown as string[];
    const Key = path.join("/");
    const result = await deleteFileS3({ Key });
    return successHandler({
      res,
      message: "File deleted successfully",
    });
  };
  // ============================ deleteMultiFiles ============================
  deleteMultiFiles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { Keys, Quiet = false }: deleteMultiFilesDTO = req.body;
    const result = await deleteMultiFilesS3({ Keys, Quiet });
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

  // ============================ sendFriendRequest ============================
  sendFriendRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = res.locals.user;
    const { to } = req.params as unknown as sendFriendRequestDTO;
    // step: check user not send for himself
    if (user._id == to) {
      throw new ApplicationExpection(
        "You can't send friend request for your self",
        400
      );
    }
    // step: check to existance
    const friend = await this.userModel.findOne({ filter: { _id: to } });
    if (!friend) {
      throw new ApplicationExpection("User not found", 404);
    }
    // step: check if friend req existance
    const isFriendRequestExistance = await this.friendRequestModel.findOne({
      filter: {
        $or: [
          { from: user._id, to },
          { from: to, to: user._id },
        ],
      },
    });
    if (isFriendRequestExistance) {
      throw new ApplicationExpection("There is already a friend request.", 400);
    }
    // step: create friend request
    const friendReq = await this.friendRequestModel.create({
      data: {
        from: user._id,
        to,
      },
    });
    return successHandler({
      res,
      message: "Friend request sended successfully",
      result: { friendReq },
    });
  };

  // ============================ accepetFriendRequest ============================
  accepetFriendRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user: HydratedDocument<IUser> = res.locals.user;
    const friendRequestId = req.params
      .friendRequestId as unknown as acceptFriendRequestDTO;
    // step: check friend request existance
    const friendRequest = await this.friendRequestModel.findOne({
      filter: {
        _id: friendRequestId,
        to: user._id,
        acceptedAt: { $exists: false },
      },
    });
    if (!friendRequest) {
      throw new ApplicationExpection("Friend request not found", 404);
    }
    // step: accept friend request
    await friendRequest.updateOne({
      $set: { acceptedAt: new Date(Date.now()) },
    });
    // step: add (user) to (friend friends list) and add (friend) to (user friends list)
    await this.friendRequestModel.findOneAndUpdate({
      filter: { _id: user._id },
      data: { $push: { friends: friendRequest.from } },
    });
    await this.friendRequestModel.findOneAndUpdate({
      filter: { _id: friendRequest.from },
      data: { $push: { friends: user._id } },
    });

    return successHandler({
      res,
      message: "Friend request accepted successfully",
    });
  };
}
