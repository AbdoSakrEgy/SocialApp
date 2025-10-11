"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_upload_1 = require("./multer.upload");
const fs_1 = require("fs");
const S3_config_1 = require("./S3.config");
const Errors_1 = require("../Errors");
const uploadFileS3 = async ({ Bucket = process.env.BUCKET_NAME, ACL = "private", path = "general", file, storeIn = multer_upload_1.StoreIn.memory, }) => {
    const command = new client_s3_1.PutObjectCommand({
        Bucket,
        ACL,
        Key: `SocialApp/${path}`,
        Body: storeIn == multer_upload_1.StoreIn.memory ? file.buffer : (0, fs_1.createReadStream)(file.path),
        ContentType: file.mimetype,
    });
    await (0, S3_config_1.S3Config)().send(command);
    if (!command.input.Key) {
        throw new Errors_1.ApplicationExpection("Upload file failed", 500);
    }
    return command.input.Key;
};
exports.uploadFileS3 = uploadFileS3;
