"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const Storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        console.log('imagePath from service routes.ts:', path_1.default.join(__dirname, '../public'));
        cb(null, path_1.default.join(__dirname, '../public'));
    },
    filename: function (req, file, cb) {
        // const name=Date.now()+'_'+file.originalname
        const name = `${Date.now()}_${file.originalname}`;
        cb(null, name);
    }
});
exports.upload = (0, multer_1.default)({ storage: Storage });
