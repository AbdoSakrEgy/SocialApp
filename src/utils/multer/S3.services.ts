import { ObjectCannedACL, PutObjectCommand } from "@aws-sdk/client-s3";
import { StoreIn } from "./multer.upload";
import { createReadStream } from "fs";
import { S3Config } from "./S3.config";
import { ApplicationExpection } from "../Errors";

export const uploadFileS3 = async ({
  Bucket = process.env.BUCKET_NAME as string,
  ACL = "private",
  path = "general",
  file,
  storeIn = StoreIn.memory,
}: {
  Bucket?: string;
  ACL?: ObjectCannedACL;
  path?: string;
  file: Express.Multer.File;
  storeIn?: StoreIn;
}): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket,
    ACL,
    Key: `SocialApp/${path}`,
    Body: storeIn == StoreIn.memory ? file.buffer : createReadStream(file.path),
    ContentType: file.mimetype,
  });
  await S3Config().send(command);
  if (!command.input.Key) {
    throw new ApplicationExpection("Upload file failed", 500);
  }
  return command.input.Key;
};
