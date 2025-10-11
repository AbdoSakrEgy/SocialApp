"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteS3Files = exports.deleteS3File = exports.createGetPreSignedURLS3 = exports.getS3File = exports.createPreSignedURLS3 = exports.uploadMultiFilesS3 = exports.uploadSingleLargeFileS3 = exports.uploadSingleSmallFileS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_upload_1 = require("./multer.upload");
const fs_1 = require("fs");
const S3_config_1 = require("./S3.config");
const Errors_1 = require("../Errors");
const nanoid_1 = require("nanoid");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
// ============================ uploadSingleSmallFileS3 ============================
const uploadSingleSmallFileS3 = async ({ Bucket = process.env.BUCKET_NAME, ACL = "private", dest = "general", fileFromMulter, storeIn = multer_upload_1.StoreIn.memory, }) => {
    const command = new client_s3_1.PutObjectCommand({
        Bucket,
        ACL,
        Key: `SocialApp/${dest}/${fileFromMulter.originalname}__${(0, nanoid_1.nanoid)(15)}`,
        Body: storeIn == multer_upload_1.StoreIn.memory
            ? fileFromMulter.buffer
            : (0, fs_1.createReadStream)(fileFromMulter.path),
        ContentType: fileFromMulter.mimetype,
    });
    await (0, S3_config_1.S3Config)().send(command);
    if (!command.input.Key) {
        throw new Errors_1.ApplicationExpection("Error while uploading file", 500);
    }
    return command.input.Key;
};
exports.uploadSingleSmallFileS3 = uploadSingleSmallFileS3;
// ============================ uploadSingleLargeFileS3 ============================
const uploadSingleLargeFileS3 = async ({ Bucket = process.env.BUCKET_NAME, ACL = "private", dest = "general", fileFromMulter, storeIn = multer_upload_1.StoreIn.memory, }) => {
    const upload = new lib_storage_1.Upload({
        client: (0, S3_config_1.S3Config)(),
        // partSize: 10 * 1024 * 1024,
        params: {
            Bucket,
            ACL,
            Key: `SocialApp/${dest}/${fileFromMulter.originalname}__${(0, nanoid_1.nanoid)(15)}`,
            Body: storeIn == multer_upload_1.StoreIn.memory
                ? fileFromMulter.buffer
                : (0, fs_1.createReadStream)(fileFromMulter.path),
            ContentType: fileFromMulter.mimetype,
        },
    });
    upload.on("httpUploadProgress", (process) => {
        console.log({ process });
    });
    const { Key } = await upload.done(); // Note: it is "Key" not "key"
    if (!Key) {
        throw new Errors_1.ApplicationExpection("Error while uploading file", 500);
    }
    return Key;
};
exports.uploadSingleLargeFileS3 = uploadSingleLargeFileS3;
// ============================ uploadMultiFilesS3 ============================
const uploadMultiFilesS3 = async ({ Bucket = process.env.BUCKET_NAME, ACL = "private", dest = "general", filesFromMulter, storeIn = multer_upload_1.StoreIn.memory, }) => {
    // fast upload
    const keys = Promise.all(filesFromMulter.map((fileFromMulter) => {
        if (storeIn == multer_upload_1.StoreIn.memory) {
            return (0, exports.uploadSingleSmallFileS3)({
                Bucket,
                ACL,
                dest,
                fileFromMulter,
                storeIn,
            });
        }
        else {
            return (0, exports.uploadSingleLargeFileS3)({
                Bucket,
                ACL,
                dest,
                fileFromMulter,
                storeIn,
            });
        }
    }));
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
exports.uploadMultiFilesS3 = uploadMultiFilesS3;
// ============================ createPreSignedURLS3 ============================
const createPreSignedURLS3 = async ({ Bucket = process.env.BUCKET_NAME, ACL = "private", dest = "general", fileName, ContentType, expiresIn = 5 * 60, }) => {
    const command = new client_s3_1.PutObjectCommand({
        Bucket,
        ACL,
        Key: `SocialApp/${dest}/${fileName}__${(0, nanoid_1.nanoid)(15)}`,
        ContentType,
    });
    const url = await (0, s3_request_presigner_1.getSignedUrl)((0, S3_config_1.S3Config)(), command, { expiresIn });
    if (!url || !command.input.Key) {
        throw new Errors_1.ApplicationExpection("Fail to generate preSignedURL", 500);
    }
    return { url, Key: command.input.Key };
};
exports.createPreSignedURLS3 = createPreSignedURLS3;
// ============================ getS3File ============================
const getS3File = async ({ Bucket = process.env.BUCKET_NAME, Key, }) => {
    const command = new client_s3_1.GetObjectCommand({ Bucket, Key });
    const result = await (0, S3_config_1.S3Config)().send(command);
    return result;
};
exports.getS3File = getS3File;
// ============================ createGetPreSignedURLS3 ============================
const createGetPreSignedURLS3 = async ({ Bucket = process.env.BUCKET_NAME, Key, downloadName = "dumy", download = false, expiresIn = 5 * 60, }) => {
    const command = new client_s3_1.GetObjectCommand({
        Bucket,
        Key,
        ResponseContentDisposition: download
            ? `attachment; filename=${downloadName}`
            : undefined,
    });
    const url = await (0, s3_request_presigner_1.getSignedUrl)((0, S3_config_1.S3Config)(), command, { expiresIn });
    if (!url) {
        throw new Errors_1.ApplicationExpection("Failed to generate preSignedURL", 500);
    }
    return url;
};
exports.createGetPreSignedURLS3 = createGetPreSignedURLS3;
// ============================ deleteS3File ============================
const deleteS3File = async ({ Bucket = process.env.BUCKET_NAME, Key, }) => {
    const command = new client_s3_1.DeleteObjectCommand({ Bucket, Key });
    const result = await (0, S3_config_1.S3Config)().send(command);
    return result;
};
exports.deleteS3File = deleteS3File;
// ============================ deleteS3Files ============================
const deleteS3Files = async ({ Bucket = process.env.BUCKET_NAME, Keys, Quiet = false, }) => {
    const Objects = Keys?.map((Key) => {
        return { Key };
    });
    const command = new client_s3_1.DeleteObjectsCommand({
        Bucket,
        Delete: {
            Objects,
            Quiet,
        },
    });
    const result = await (0, S3_config_1.S3Config)().send(command);
    return result;
};
exports.deleteS3Files = deleteS3Files;
