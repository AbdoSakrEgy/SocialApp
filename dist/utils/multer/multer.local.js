"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multer_localUpload = exports.fileTypes = exports.StoreIn = void 0;
const multer_1 = __importDefault(require("multer"));
const Errors_1 = require("../Errors");
var StoreIn;
(function (StoreIn) {
    StoreIn["disk"] = "disk";
    StoreIn["memory"] = "memory";
})(StoreIn || (exports.StoreIn = StoreIn = {}));
exports.fileTypes = {
    image: ["image/jpg", "image/jpeg", "image/png", "image/gif", "image/webp"],
    video: ["video/mp4", "video/webm"],
};
const multer_localUpload = ({ storeIn = StoreIn.memory, type = exports.fileTypes.image, }) => {
    const storage = storeIn == "memory" ? multer_1.default.memoryStorage() : multer_1.default.diskStorage({});
    const fileFilter = (req, file, cb) => {
        // if (file.size > 200 * 1024 * 1024 && storeIn == StoreIn.memory) {
        //   return cb(new ApplicationExpection("Use disk not memory", 400), false);
        // } else
        if (!type.includes(file.mimetype)) {
            return cb(new Errors_1.ApplicationExpection("Invalid file format", 400), false);
        }
        cb(null, true);
    };
    return (0, multer_1.default)({ storage, fileFilter });
};
exports.multer_localUpload = multer_localUpload;
