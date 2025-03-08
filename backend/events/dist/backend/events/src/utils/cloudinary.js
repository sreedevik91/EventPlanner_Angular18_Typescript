"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImgUrl = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// export default cloudinary
const getImgUrl = (img, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadResult = yield cloudinary_1.v2.uploader.upload(img, options);
        console.log('cloudinary img upload result: ', uploadResult);
        return { success: true, data: { imgUrl: uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.url, type: uploadResult.resource_type } };
    }
    catch (error) {
        return { success: false, message: 'Image not saved.' };
    }
});
exports.getImgUrl = getImgUrl;
