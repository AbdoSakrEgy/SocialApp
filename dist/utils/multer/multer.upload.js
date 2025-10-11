"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUpload = exports.fileTypes = exports.StoreIn = void 0;
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
const multerUpload = ({ sendedFileDest = "general", sendedFileType = exports.fileTypes.image, storeIn = StoreIn.memory, }) => {
    const storage = storeIn == StoreIn.memory
        ? multer_1.default.memoryStorage()
        : multer_1.default.diskStorage({
        // destination: (req: any, file, cb) => {
        //   const fullDest = `uploads/${sendedFileDest}/${req.user._id}`;
        //   if (!fs.existsSync(fullDest)) {
        //     fs.mkdirSync(fullDest, { recursive: true });
        //   }
        //   cb(null, fullDest);
        // },
        // filename: (req: any, file, cb) => {
        //   cb(null, `${file.originalname}`);
        // },
        });
    const fileFilter = (req, file, cb) => {
        if (file.size > 200 * 1024 * 1024 && storeIn == StoreIn.memory) {
            return cb(new Errors_1.ApplicationExpection("Use disk not memory", 400), false);
        }
        else if (!sendedFileType.includes(file.mimetype)) {
            return cb(new Errors_1.ApplicationExpection("Invalid file format", 400), false);
        }
        cb(null, true);
    };
    return (0, multer_1.default)({ storage, fileFilter });
};
exports.multerUpload = multerUpload;
