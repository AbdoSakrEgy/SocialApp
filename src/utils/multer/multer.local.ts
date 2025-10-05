import multer from "multer";
import { ApplicationExpection } from "../Errors";
import { Request } from "express";
export enum StoreIn {
  disk = "disk",
  memory = "memory",
}
export const fileTypes = {
  image: ["image/jpg", "image/jpeg", "image/png", "image/gif", "image/webp"],
  video: ["video/mp4", "video/webm"],
};

export const multer_localUpload = ({
  storeIn = StoreIn.memory,
  type = fileTypes.image,
}: {
  storeIn?: StoreIn;
  type?: String[];
}) => {
  const storage =
    storeIn == "memory" ? multer.memoryStorage() : multer.diskStorage({});

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: CallableFunction
  ) => {
    // if (file.size > 200 * 1024 * 1024 && storeIn == StoreIn.memory) {
    //   return cb(new ApplicationExpection("Use disk not memory", 400), false);
    // } else
    if (!type.includes(file.mimetype)) {
      return cb(new ApplicationExpection("Invalid file format", 400), false);
    }
    cb(null, true);
  };
  return multer({ storage, fileFilter });
};
