import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  DeleteObjectsCommand,
  GetObjectCommand,
  GetObjectCommandOutput,
  ObjectCannedACL,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { StoreIn } from "./multer.upload";
import { createReadStream } from "fs";
import { S3Config } from "./S3.config";
import { ApplicationExpection } from "../Errors";
import { nanoid } from "nanoid";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// ============================ uploadSingleSmallFileS3 ============================
export const uploadSingleSmallFileS3 = async ({
  Bucket = process.env.BUCKET_NAME as string,
  ACL = "private",
  dest = "general",
  fileFromMulter,
  storeIn = StoreIn.memory,
}: {
  Bucket?: string;
  ACL?: ObjectCannedACL;
  dest?: string;
  fileFromMulter: Express.Multer.File;
  storeIn?: StoreIn;
}): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket,
    ACL,
    Key: `SocialApp/${dest}/${fileFromMulter.originalname}__${nanoid(15)}`,
    Body:
      storeIn == StoreIn.memory
        ? fileFromMulter.buffer
        : createReadStream(fileFromMulter.path),
    ContentType: fileFromMulter.mimetype,
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
  dest = "general",
  fileFromMulter,
  storeIn = StoreIn.memory,
}: {
  Bucket?: string;
  ACL?: ObjectCannedACL;
  dest?: string;
  fileFromMulter: Express.Multer.File;
  storeIn?: StoreIn;
}): Promise<string> => {
  const upload = new Upload({
    client: S3Config(),
    // partSize: 10 * 1024 * 1024,
    params: {
      Bucket,
      ACL,
      Key: `SocialApp/${dest}/${fileFromMulter.originalname}__${nanoid(15)}`,
      Body:
        storeIn == StoreIn.memory
          ? fileFromMulter.buffer
          : createReadStream(fileFromMulter.path),
      ContentType: fileFromMulter.mimetype,
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
  dest = "general",
  filesFromMulter,
  storeIn = StoreIn.memory,
}: {
  Bucket?: string;
  ACL?: ObjectCannedACL;
  dest?: string;
  filesFromMulter: Express.Multer.File[];
  storeIn?: StoreIn;
}): Promise<string[]> => {
  // fast upload
  const keys = Promise.all(
    filesFromMulter.map((fileFromMulter) => {
      if (storeIn == StoreIn.memory) {
        return uploadSingleSmallFileS3({
          Bucket,
          ACL,
          dest,
          fileFromMulter,
          storeIn,
        });
      } else {
        return uploadSingleLargeFileS3({
          Bucket,
          ACL,
          dest,
          fileFromMulter,
          storeIn,
        });
      }
    })
  );
  return keys;
  // slow upload
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

// ============================ createPreSignedURLS3 ============================
export const createPreSignedURLS3 = async ({
  Bucket = process.env.BUCKET_NAME as string,
  ACL = "private",
  dest = "general",
  fileName,
  ContentType,
  expiresIn = 5 * 60,
}: {
  Bucket?: string;
  ACL?: ObjectCannedACL;
  dest?: string;
  fileName: String;
  ContentType: string;
  expiresIn?: number;
}): Promise<{ url: string; Key: string }> => {
  const command = new PutObjectCommand({
    Bucket,
    ACL,
    Key: `SocialApp/${dest}/${fileName}__${nanoid(15)}`,
    ContentType,
  });

  const url = await getSignedUrl(S3Config(), command, { expiresIn });
  if (!url || !command.input.Key) {
    throw new ApplicationExpection("Fail to generate preSignedURL", 500);
  }
  return { url, Key: command.input.Key };
};

// ============================ getS3File ============================
export const getS3File = async ({
  Bucket = process.env.BUCKET_NAME as string,
  Key,
}: {
  Bucket?: string;
  Key?: string;
}): Promise<GetObjectCommandOutput> => {
  const command = new GetObjectCommand({ Bucket, Key });
  const result = await S3Config().send(command);
  return result;
};

// ============================ createGetPreSignedURLS3 ============================
export const createGetPreSignedURLS3 = async ({
  Bucket = process.env.BUCKET_NAME as string,
  Key,
  downloadName = "dumy",
  download = false,
  expiresIn = 5 * 60,
}: {
  Bucket?: string;
  Key: string;
  downloadName?: string | undefined;
  download?: boolean;
  expiresIn?: number;
}): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket,
    Key,
    ResponseContentDisposition: download
      ? `attachment; filename=${downloadName}`
      : undefined,
  });
  const url = await getSignedUrl(S3Config(), command, { expiresIn });
  if (!url) {
    throw new ApplicationExpection("Failed to generate preSignedURL", 500);
  }
  return url;
};

// ============================ deleteS3File ============================
export const deleteS3File = async ({
  Bucket = process.env.BUCKET_NAME as string,
  Key,
}: {
  Bucket?: string;
  Key?: string;
}): Promise<DeleteObjectCommandOutput> => {
  const command = new DeleteObjectCommand({ Bucket, Key });
  const result = await S3Config().send(command);
  return result;
};

// ============================ deleteS3Files ============================
export const deleteS3Files = async ({
  Bucket = process.env.BUCKET_NAME as string,
  Keys,
  Quiet = false,
}: {
  Bucket?: string;
  Keys?: string[];
  Quiet?: boolean | undefined;
}): Promise<DeleteObjectCommandOutput> => {
  const Objects = Keys?.map((Key) => {
    return { Key };
  });
  const command = new DeleteObjectsCommand({
    Bucket,
    Delete: {
      Objects,
      Quiet,
    },
  });
  const result = await S3Config().send(command);
  return result;
};
