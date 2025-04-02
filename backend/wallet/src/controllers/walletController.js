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
exports.WalletController = void 0;
// import bookingServices from "../services/bookingServices";
const walletInterfaces_1 = require("../interfaces/walletInterfaces");
const appError_1 = require("../utils/appError");
const responseHandler_1 = require("../middlewares/responseHandler");
class WalletController {
    constructor(walletServices) {
        this.walletServices = walletServices;
    }
    getWalletById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const walletData = yield this.walletServices.getWalletById(id);
                console.log('getWalletById controller response: ', walletData);
                (walletData === null || walletData === void 0 ? void 0 : walletData.success) ? responseHandler_1.ResponseHandler.successResponse(res, walletInterfaces_1.HttpStatusCodes.OK, walletData) : next(new appError_1.AppError(walletData));
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from getWalletById controller: ', error.message) : console.log('Unknown error from getWalletById controller: ', error);
                next(new appError_1.AppError({ success: false, message: walletInterfaces_1.CONTROLLER_RESPONSES.commonError }));
            }
        });
    }
    getWalletByUserId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const userWalletData = yield this.walletServices.getWalletByUserId(userId);
                console.log('getWalletByUserId controller response: ', userWalletData);
                (userWalletData === null || userWalletData === void 0 ? void 0 : userWalletData.success) ? responseHandler_1.ResponseHandler.successResponse(res, walletInterfaces_1.HttpStatusCodes.OK, userWalletData) : next(new appError_1.AppError(userWalletData));
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from getWalletByUserId controller: ', error.message) : console.log('Unknown error from getWalletByUserId controller: ', error);
                next(new appError_1.AppError({ success: false, message: walletInterfaces_1.CONTROLLER_RESPONSES.commonError }));
            }
        });
    }
    updateWalletById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { data } = req.body;
                const updatedWallet = yield this.walletServices.updateWalletById(id, data);
                console.log('updateWalletById controller response: ', updatedWallet);
                (updatedWallet === null || updatedWallet === void 0 ? void 0 : updatedWallet.success) ? responseHandler_1.ResponseHandler.successResponse(res, walletInterfaces_1.HttpStatusCodes.OK, updatedWallet) : next(new appError_1.AppError(updatedWallet));
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from updateWalletById controller: ', error.message) : console.log('Unknown error from updateWalletById controller: ', error);
                next(new appError_1.AppError({ success: false, message: walletInterfaces_1.CONTROLLER_RESPONSES.commonError }));
            }
        });
    }
    deleteWalletById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deleteWallet = yield this.walletServices.deleteWalletById(id);
                console.log('deleteWalletById controller response: ', deleteWallet);
                (deleteWallet === null || deleteWallet === void 0 ? void 0 : deleteWallet.success) ? responseHandler_1.ResponseHandler.successResponse(res, walletInterfaces_1.HttpStatusCodes.OK, deleteWallet) : next(new appError_1.AppError(deleteWallet));
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from deleteWalletById controller: ', error.message) : console.log('Unknown error from deleteWalletById controller: ', error);
                next(new appError_1.AppError({ success: false, message: walletInterfaces_1.CONTROLLER_RESPONSES.commonError }));
            }
        });
    }
    createWallet(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = req.body;
                const newWallet = yield this.walletServices.createWallet(data);
                console.log('createWallet controller response: ', newWallet);
                (newWallet === null || newWallet === void 0 ? void 0 : newWallet.success) ? responseHandler_1.ResponseHandler.successResponse(res, walletInterfaces_1.HttpStatusCodes.OK, newWallet) : next(new appError_1.AppError(newWallet));
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from createWallet controller: ', error.message) : console.log('Unknown error from createWallet controller: ', error);
                next(new appError_1.AppError({ success: false, message: walletInterfaces_1.CONTROLLER_RESPONSES.commonError }));
            }
        });
    }
}
exports.WalletController = WalletController;
