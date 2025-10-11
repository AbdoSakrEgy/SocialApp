"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerLocalUpload = exports.fileTypes = exports.StoreIn = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
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
/*
 *    This method work as middleware, work once for each single file uploaded,
 *    so "file" argument is object of file info not array of files,
 *    //file =          {fieldname,originalname,encoding,mimetype}
 *    after this method finish it ==store file== and ==add"file"or"files"propertyTo"req"==
 *    //file or files = {fieldname,originalname,encoding,mimetype,destination,filename,path,size} || [{...}]
 *    fieldname => name of field sended from body
 *    originalname => orignal name of sended file
 *    mimetype => type of sended file
 *    destination =>sended file will store on localServer to this distination
 *    filename => sended file will renamed on lacalServer as this name
 *    path =>  destination + filename
 */
const multerLocalUpload = ({ dest = "general", type = exports.fileTypes.image, storeIn = StoreIn.disk, }) => {
    const storage = storeIn == StoreIn.memory
        ? multer_1.default.memoryStorage()
        : multer_1.default.diskStorage({
            // destination: "uploads",
            destination: (req, file, callback) => {
                const fullDest = `uploads/${dest}/${req.user._id}`;
                if (!fs_1.default.existsSync(fullDest)) {
                    fs_1.default.mkdirSync(fullDest, { recursive: true });
                }
                callback(null, fullDest); //* Will store file
            },
            filename: (req, file, callback) => {
                callback(null, `${file.originalname}`);
            },
        });
    const fileFilter = (req, file, cb) => {
        if (file.size > 200 * 1024 * 1024 && storeIn == StoreIn.memory) {
            return cb(new Errors_1.ApplicationExpection("Use disk not memory", 400), false);
        }
        else if (!type.includes(file.mimetype)) {
            return cb(new Errors_1.ApplicationExpection("Invalid file format", 400), false);
        }
        cb(null, true);
    };
    return (0, multer_1.default)({ storage, fileFilter });
};
exports.multerLocalUpload = multerLocalUpload;
