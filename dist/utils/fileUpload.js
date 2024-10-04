"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.fileSizeFormatter = void 0;
const multer_1 = __importDefault(require("multer"));
//Define file storage
const storage = multer_1.default.diskStorage({
    // destination: function (req, file, cb) {
    //   cb(null, "uploads");
    // },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname);
    },
});
//Spefify file format that can be saved
const fileSizeFormatter = (bytes, decimal) => {
    if (bytes === 0) {
        return "0 Bytes";
    }
    const dm = decimal || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return (parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + sizes[index]);
};
exports.fileSizeFormatter = fileSizeFormatter;
exports.upload = (0, multer_1.default)({ storage });
//# sourceMappingURL=fileUpload.js.map