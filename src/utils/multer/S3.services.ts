import { ObjectCannedACL, PutObjectCommand } from "@aws-sdk/client-s3";
import { StoreIn } from "./multer.upload";
import { createReadStream } from "fs";
import { S3Config } from "./S3.config";
import { ApplicationExpection } from "../Errors";
import { nanoid } from "nanoid";
import { Upload } from "@aws-sdk/lib-storage";

// ============================ uploadSingleFileS3 ============================
export const uploadSingleFileS3 = async ({
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
    Key: `SocialApp/${path}/${file.fieldname}__${nanoid(15)}`,
    Body: storeIn == StoreIn.memory ? file.buffer : createReadStream(file.path),
    ContentType: file.mimetype,
  });
  await S3Config().send(command);
  if (!command.input.Key) {
    throw new ApplicationExpection("Error while uploading file", 500);
  }
  return command.input.Key;
};

// ============================ uploadSingleLargeFileS3 ============================
export const uploadSingleLargeFileS3 = async ({
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
  const upload = new Upload({
    client: S3Config(),
    partSize: 10 * 1024 * 1024,
    params: {
      Bucket,
      ACL,
      Key: `SocialApp/${path}/${file.fieldname}__${nanoid(15)}`,
      Body:
        storeIn == StoreIn.memory ? file.buffer : createReadStream(file.path),
      ContentType: file.mimetype,
    },
  });
  upload.on("httpUploadProgress", (process) => {
    console.log({ process });
  });
  const { Key } = await upload.done(); // Note: it is "Key" not "key"
  if (!Key) {
    throw new ApplicationExpection("Error while uploading file", 500);
  }
  return Key;
};

// ============================ uploadMultiFilesS3 ============================
export const uploadMultiFilesS3 = async ({
  Bucket = process.env.BUCKET_NAME as string,
  ACL = "private",
  path = "general",
  files,
  storeIn = StoreIn.memory,
}: {
  Bucket?: string;
  ACL?: ObjectCannedACL;
  path?: string;
  files: Express.Multer.File[];
  storeIn?: StoreIn;
}): Promise<string[]> => {
  // fast upload
  const keys = Promise.all(
    files.map((file) => {
      if (storeIn == StoreIn.memory) {
        return uploadSingleFileS3({
          Bucket,
          ACL,
          path,
          file,
          storeIn,
        });
      } else {
        return uploadSingleLargeFileS3({
          Bucket,
          ACL,
          path,
          file,
          storeIn,
        });
      }
    })
  );
  return keys;
  //? slow upload
  // const keys = [];
  // for (const file of files) {
  //   if (storeIn == StoreIn.memory) {
  //     const key = await uploadSingleFileS3({
  //       Bucket,
  //       ACL,
  //       path,
  //       file,
  //       storeIn,
  //     });
  //     keys.push(key);
  //   } else {
  //     const key = await uploadSingleLargeFileS3({
  //       Bucket,
  //       ACL,
  //       path,
  //       file,
  //       storeIn,
  //     });
  //     keys.push(key);
  //   }
  // }
  // return keys;
};
