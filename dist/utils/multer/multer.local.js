"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerLocal = exports.fileTypes = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const Errors_1 = require("../Errors");
exports.fileTypes = {
    image: ["image/jpg", "image/jpeg", "image/png", "image/gif", "image/webp"],
    video: ["video/mp4", "video/webm"],
};
const multerLocal = ({ sendedFileDest = "general", sendedFileType = exports.fileTypes.image, }) => {
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            const fullDest = `uploads/${sendedFileDest}/${req.user._id}`;
            if (!fs_1.default.existsSync(fullDest)) {
                fs_1.default.mkdirSync(fullDest, { recursive: true });
            }
            cb(null, fullDest);
        },
        filename: (req, file, cb) => {
            cb(null, `${file.originalname}`);
        },
    });
    const fileFilter = (req, file, cb) => {
        if (!sendedFileType.includes(file.mimetype)) {
            return cb(new Errors_1.ApplicationExpection("Invalid file format", 400), false);
        }
        cb(null, true);
    };
    return (0, multer_1.default)({ storage, fileFilter });
};
exports.multerLocal = multerLocal;
