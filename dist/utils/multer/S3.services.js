"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiFilesS3 = exports.uploadSingleLargeFileS3 = exports.uploadSingleFileS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_upload_1 = require("./multer.upload");
const fs_1 = require("fs");
const S3_config_1 = require("./S3.config");
const Errors_1 = require("../Errors");
const nanoid_1 = require("nanoid");
const lib_storage_1 = require("@aws-sdk/lib-storage");
// ============================ uploadSingleFileS3 ============================
const uploadSingleFileS3 = async ({ Bucket = process.env.BUCKET_NAME, ACL = "private", path = "general", file, storeIn = multer_upload_1.StoreIn.memory, }) => {
    const command = new client_s3_1.PutObjectCommand({
        Bucket,
        ACL,
        Key: `SocialApp/${path}/${file.fieldname}__${(0, nanoid_1.nanoid)(15)}`,
        Body: storeIn == multer_upload_1.StoreIn.memory ? file.buffer : (0, fs_1.createReadStream)(file.path),
        ContentType: file.mimetype,
    });
    await (0, S3_config_1.S3Config)().send(command);
    if (!command.input.Key) {
        throw new Errors_1.ApplicationExpection("Error while uploading file", 500);
    }
    return command.input.Key;
};
exports.uploadSingleFileS3 = uploadSingleFileS3;
// ============================ uploadSingleLargeFileS3 ============================
const uploadSingleLargeFileS3 = async ({ Bucket = process.env.BUCKET_NAME, ACL = "private", path = "general", file, storeIn = multer_upload_1.StoreIn.memory, }) => {
    const upload = new lib_storage_1.Upload({
        client: (0, S3_config_1.S3Config)(),
        partSize: 10 * 1024 * 1024,
        params: {
            Bucket,
            ACL,
            Key: `SocialApp/${path}/${file.fieldname}__${(0, nanoid_1.nanoid)(15)}`,
            Body: storeIn == multer_upload_1.StoreIn.memory ? file.buffer : (0, fs_1.createReadStream)(file.path),
            ContentType: file.mimetype,
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
const uploadMultiFilesS3 = async ({ Bucket = process.env.BUCKET_NAME, ACL = "private", path = "general", files, storeIn = multer_upload_1.StoreIn.memory, }) => {
    // fast upload
    const keys = Promise.all(files.map((file) => {
        if (storeIn == multer_upload_1.StoreIn.memory) {
            return (0, exports.uploadSingleFileS3)({
                Bucket,
                ACL,
                path,
                file,
                storeIn,
            });
        }
        else {
            return (0, exports.uploadSingleLargeFileS3)({
                Bucket,
                ACL,
                path,
                file,
                storeIn,
            });
        }
    }));
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
exports.uploadMultiFilesS3 = uploadMultiFilesS3;
