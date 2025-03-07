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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceController = void 0;
// import serviceServices from "../services/serviceServices"
const serviceInterfaces_1 = require("../interfaces/serviceInterfaces");
const cloudinary_1 = require("../utils/cloudinary");
const responseHandler_1 = require("../utils/responseHandler");
class ServiceController {
    constructor(serviceServices) {
        this.serviceServices = serviceServices;
    }
    getTotalServices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const servicesCount = yield this.serviceServices.totalServices();
                console.log('getTotalServices controller response: ', servicesCount);
                // servicesCount?.success ? res.status(200).json(servicesCount) : res.status(400).json(servicesCount)
                (servicesCount === null || servicesCount === void 0 ? void 0 : servicesCount.success) ? responseHandler_1.ResponseHandler.successResponse(res, serviceInterfaces_1.HttpStatusCodes.OK, servicesCount) : responseHandler_1.ResponseHandler.errorResponse(res, serviceInterfaces_1.HttpStatusCodes.BAD_REQUEST, servicesCount);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from getTotalServices controller: ', error.message) : console.log('Unknown error from getTotalServices controller: ', error);
                // res.status(500).json(error.message)
                responseHandler_1.ResponseHandler.errorResponse(res, serviceInterfaces_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' });
            }
        });
    }
    createService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // const {name,provider,events,choices}= req.body
                console.log('new service to register from angular: ', req.body);
                console.log('new service images to register: ', req.files);
                const { name, events, provider, choices } = req.body;
                // const files: { [fieldname: string]: Express.Multer.File[]; } | Express.Multer.File[] | undefined = req.files
                const files = req.files;
                let imgName = (files === null || files === void 0 ? void 0 : files.img) ? files === null || files === void 0 ? void 0 : files.img[0].filename : '';
                let imgPath = (files === null || files === void 0 ? void 0 : files.img) ? files === null || files === void 0 ? void 0 : files.img[0].path : '';
                // let imgFiles = files?.img ?? []; // Ensure imgFiles is always an array
                // let imgName = imgFiles.length > 0 ? imgFiles[0].filename : '';
                // let imgPath = imgFiles.length > 0 ? imgFiles[0].path : '';
                // let cloudinaryImgData = await cloudinary.uploader.upload(imgPath, { public_id: imgName ,type:"authenticated",sign_url: true})
                let cloudinaryImgData = yield (0, cloudinary_1.getImgUrl)(imgPath, { public_id: imgName, type: "authenticated", sign_url: true });
                let img = (_a = cloudinaryImgData.data) === null || _a === void 0 ? void 0 : _a.imgUrl;
                let choicesArray = JSON.parse(choices);
                let choicesWithImg = yield Promise.all(choicesArray.map((choice, index) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const choiceImgFile = files === null || files === void 0 ? void 0 : files.choiceImg;
                    console.log('choiceImgFileName: ', (_a = files === null || files === void 0 ? void 0 : files.choiceImg[index]) === null || _a === void 0 ? void 0 : _a.filename);
                    const { choiceImgCategory } = choice, rest = __rest(choice, ["choiceImgCategory"]);
                    for (let img of choiceImgFile) {
                        if (choiceImgCategory === img.originalname) {
                            let cloudinaryImgData = yield (0, cloudinary_1.getImgUrl)(img.path, { public_id: img.filename, type: "authenticated", sign_url: true });
                            let imgUrl = (_b = cloudinaryImgData.data) === null || _b === void 0 ? void 0 : _b.imgUrl;
                            rest.choiceImg = imgUrl;
                        }
                    }
                    return rest;
                })));
                const data = {
                    name,
                    img,
                    events: JSON.parse(events),
                    provider,
                    choices: choicesWithImg
                };
                console.log('new service to register: ', data);
                const newService = yield this.serviceServices.addService(data);
                console.log('createService controller response: ', newService);
                // response?.success ? res.status(201).json(response) : res.status(400).json(response)
                (newService === null || newService === void 0 ? void 0 : newService.success) ? responseHandler_1.ResponseHandler.successResponse(res, serviceInterfaces_1.HttpStatusCodes.CREATED, newService) : responseHandler_1.ResponseHandler.errorResponse(res, serviceInterfaces_1.HttpStatusCodes.BAD_REQUEST, newService);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from createService controller: ', error.message) : console.log('Unknown error from createService controller: ', error);
                // res.status(500).json(error.message)
                responseHandler_1.ResponseHandler.errorResponse(res, serviceInterfaces_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' });
            }
        });
    }
    getAllServices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let services = yield this.serviceServices.getServices(req.query);
                // services?.success ? res.status(200).json(services) : res.status(400).json(services)
                (services === null || services === void 0 ? void 0 : services.success) ? responseHandler_1.ResponseHandler.successResponse(res, serviceInterfaces_1.HttpStatusCodes.OK, services) : responseHandler_1.ResponseHandler.errorResponse(res, serviceInterfaces_1.HttpStatusCodes.BAD_REQUEST, services);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from getAllServices controller: ', error.message) : console.log('Unknown error from getAllServices controller: ', error);
                // res.status(500).json(error.message)
                responseHandler_1.ResponseHandler.errorResponse(res, serviceInterfaces_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' });
            }
        });
    }
    deleteService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let deleteServices = yield this.serviceServices.deleteService(req.params.id);
                // deleteServices?.success ? res.status(200).json(deleteServices) : res.status(400).json(deleteServices)
                (deleteServices === null || deleteServices === void 0 ? void 0 : deleteServices.success) ? responseHandler_1.ResponseHandler.successResponse(res, serviceInterfaces_1.HttpStatusCodes.OK, deleteServices) : responseHandler_1.ResponseHandler.errorResponse(res, serviceInterfaces_1.HttpStatusCodes.BAD_REQUEST, deleteServices);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from deleteService controller: ', error.message) : console.log('Unknown error from deleteService controller: ', error);
                // res.status(500).json(error.message)
                responseHandler_1.ResponseHandler.errorResponse(res, serviceInterfaces_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' });
            }
        });
    }
    getServiceById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let service = yield this.serviceServices.getServiceById(req.params.id);
                // services?.success ? res.status(200).json(services) : res.status(400).json(services)
                (service === null || service === void 0 ? void 0 : service.success) ? responseHandler_1.ResponseHandler.successResponse(res, serviceInterfaces_1.HttpStatusCodes.OK, service) : responseHandler_1.ResponseHandler.errorResponse(res, serviceInterfaces_1.HttpStatusCodes.BAD_REQUEST, service);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from getServiceById controller: ', error.message) : console.log('Unknown error from getServiceById controller: ', error);
                // res.status(500).json(error.message)
                responseHandler_1.ResponseHandler.errorResponse(res, serviceInterfaces_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' });
            }
        });
    }
    editService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { id } = req.params;
                // const { data } = req.body
                console.log('service details to update: ', id, req.body);
                const { name, img, events, provider, choices } = req.body;
                // const files: any = req.files
                const files = req.files;
                console.log('service images to update: ', files);
                console.log('service choices to update: ', JSON.parse(choices));
                let choicesWithImg = JSON.parse(choices);
                let imgNew = img;
                if (files && Object.keys(files).length > 0) {
                    let imgName = (files === null || files === void 0 ? void 0 : files.img) ? files === null || files === void 0 ? void 0 : files.img[0].filename : '';
                    let imgPath = (files === null || files === void 0 ? void 0 : files.img) ? files === null || files === void 0 ? void 0 : files.img[0].path : '';
                    // if (imgPath) {
                    //     try {
                    //         let cloudinaryImgData = await cloudinary.uploader.upload(imgPath, { public_id: imgName })
                    //         imgNew = cloudinaryImgData.url || img
                    //     } catch (error: unknown) {
                    //         console.error('Error uploading service image to cloudinary:', error.message);
                    //     }
                    // }
                    if (!imgPath) {
                        console.warn('No valid image file path provided for upload.');
                        imgNew = img;
                    }
                    else {
                        let cloudinaryImgData = yield (0, cloudinary_1.getImgUrl)(imgPath, { public_id: imgName, type: "authenticated", sign_url: true });
                        imgNew = ((_a = cloudinaryImgData.data) === null || _a === void 0 ? void 0 : _a.imgUrl) || img;
                    }
                    // imgNew = files?.img ? files?.img[0].filename : img
                    let parsedArray = JSON.parse(choices);
                    choicesWithImg = yield Promise.all(parsedArray.map((choice, index) => __awaiter(this, void 0, void 0, function* () {
                        var _a, _b;
                        const choiceImgFile = files === null || files === void 0 ? void 0 : files.choiceImg;
                        console.log('choiceImgFileName: ', (_a = files === null || files === void 0 ? void 0 : files.choiceImg[index]) === null || _a === void 0 ? void 0 : _a.filename);
                        const { choiceImgCategory } = choice, rest = __rest(choice
                        // choiceImgFile.forEach((img: any) => {
                        //     if (choiceImgCategory === img.originalname) {
                        //         rest.choiceImg = img.filename
                        //     }
                        // })
                        , ["choiceImgCategory"]);
                        // choiceImgFile.forEach((img: any) => {
                        //     if (choiceImgCategory === img.originalname) {
                        //         rest.choiceImg = img.filename
                        //     }
                        // })
                        for (let img of choiceImgFile) {
                            // if (img?.path) {
                            //     try {
                            //         let cloudinaryImgData = await cloudinary.uploader.upload(img.path, { public_id: img.filename })
                            //         let imgUrl = cloudinaryImgData.url
                            //         rest.choiceImg = imgUrl
                            //     } catch (error: unknown) {
                            //         console.error('Error uploading service image to cloudinary:', error.message);
                            //     }
                            // }
                            if (!(img === null || img === void 0 ? void 0 : img.path)) {
                                console.warn(`No valid path for choice image at index ${index}.`);
                                continue;
                            }
                            let cloudinaryImgData = yield (0, cloudinary_1.getImgUrl)(img.path, { public_id: img.filename, type: "authenticated", sign_url: true });
                            let imgUrl = (_b = cloudinaryImgData.data) === null || _b === void 0 ? void 0 : _b.imgUrl;
                            rest.choiceImg = imgUrl;
                        }
                        return rest;
                    })));
                }
                // else {
                //     imgNew = img
                //     choicesWithImg = JSON.parse(choices)
                // }
                console.log('choicesWithImg: ', choicesWithImg);
                const newData = {
                    name,
                    img: imgNew,
                    events: JSON.parse(events),
                    provider,
                    choices: choicesWithImg
                };
                console.log('final service data to edit: ', newData);
                const updatedServiceResponse = yield this.serviceServices.editService(id, newData);
                // newServiceResponse?.success ? res.status(200).json(newServiceResponse) : res.status(400).json(newServiceResponse)
                (updatedServiceResponse === null || updatedServiceResponse === void 0 ? void 0 : updatedServiceResponse.success) ? responseHandler_1.ResponseHandler.successResponse(res, serviceInterfaces_1.HttpStatusCodes.OK, updatedServiceResponse) : responseHandler_1.ResponseHandler.errorResponse(res, serviceInterfaces_1.HttpStatusCodes.BAD_REQUEST, updatedServiceResponse);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from editService controller: ', error.message) : console.log('Unknown error from editService controller: ', error);
                // res.status(500).json(error.message)
                responseHandler_1.ResponseHandler.errorResponse(res, serviceInterfaces_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' });
            }
        });
    }
    editStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                // console.log('id to edit user',id);
                const newStatusResponse = yield this.serviceServices.editStatus(id);
                // newStatusResponse?.success ? res.status(200).json(newStatusResponse) : res.status(400).json(newStatusResponse)
                (newStatusResponse === null || newStatusResponse === void 0 ? void 0 : newStatusResponse.success) ? responseHandler_1.ResponseHandler.successResponse(res, serviceInterfaces_1.HttpStatusCodes.OK, newStatusResponse) : responseHandler_1.ResponseHandler.errorResponse(res, serviceInterfaces_1.HttpStatusCodes.BAD_REQUEST, newStatusResponse);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from editStatus controller: ', error.message) : console.log('Unknown error from editStatus controller: ', error);
                // res.status(500).json(error.message)
                responseHandler_1.ResponseHandler.errorResponse(res, serviceInterfaces_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' });
            }
        });
    }
    approveService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                console.log('id to verify', req.body);
                const approveServiceResponse = yield this.serviceServices.approveService(id);
                // approveServiceResponse?.success ? res.status(200).json(approveServiceResponse) : res.status(400).json(approveServiceResponse)
                (approveServiceResponse === null || approveServiceResponse === void 0 ? void 0 : approveServiceResponse.success) ? responseHandler_1.ResponseHandler.successResponse(res, serviceInterfaces_1.HttpStatusCodes.OK, approveServiceResponse) : responseHandler_1.ResponseHandler.errorResponse(res, serviceInterfaces_1.HttpStatusCodes.BAD_REQUEST, approveServiceResponse);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from approveService controller: ', error.message) : console.log('Unknown error from approveService controller: ', error);
                // res.status(500).json(error.message)
                responseHandler_1.ResponseHandler.errorResponse(res, serviceInterfaces_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' });
            }
        });
    }
    getServiceByName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.params;
                console.log('name to get service', req.params.name);
                const serviceByName = yield this.serviceServices.getServiceByName(name);
                // getServiceByName?.success ? res.status(200).json(getServiceByName) : res.status(400).json(getServiceByName)
                (serviceByName === null || serviceByName === void 0 ? void 0 : serviceByName.success) ? responseHandler_1.ResponseHandler.successResponse(res, serviceInterfaces_1.HttpStatusCodes.OK, serviceByName) : responseHandler_1.ResponseHandler.errorResponse(res, serviceInterfaces_1.HttpStatusCodes.BAD_REQUEST, serviceByName);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from getServiceByName controller: ', error.message) : console.log('Unknown error from getServiceByName controller: ', error);
                // res.status(500).json(error.message)
                responseHandler_1.ResponseHandler.errorResponse(res, serviceInterfaces_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' });
            }
        });
    }
}
exports.ServiceController = ServiceController;
// export default new ServiceController()
