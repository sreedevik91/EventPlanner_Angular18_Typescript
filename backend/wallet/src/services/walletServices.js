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
exports.WalletService = void 0;
const walletInterfaces_1 = require("../interfaces/walletInterfaces");
// import bookingRepository from "../repository/bookingRepository";
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class WalletService {
    constructor(walletRepository, emailService) {
        this.walletRepository = walletRepository;
        this.emailService = emailService;
    }
    getWalletById(walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const walletData = yield this.walletRepository.getWalletById(walletId);
                console.log('getWalletById service response: ', walletData);
                return walletData ? { success: true, data: walletData } : { success: false, message: walletInterfaces_1.SERVICE_RESPONSES.fetchDataError };
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from getWalletById service: ', error.message) : console.log('Unknown error from getWalletById service: ', error);
                return { success: false, message: walletInterfaces_1.SERVICE_RESPONSES.commonError };
            }
        });
    }
    getWalletByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userWalletData = yield this.walletRepository.getWalletByUserId(userId);
                console.log('getWalletByUserId service response: ', userWalletData);
                if (!userWalletData) {
                    const newWallet = yield this.walletRepository.createWallet({ userId, amount: 0, transactions: [] });
                    return newWallet ? { success: true, data: newWallet } : { success: false, message: walletInterfaces_1.SERVICE_RESPONSES.fetchDataError };
                }
                return userWalletData ? { success: true, data: userWalletData } : { success: false, message: walletInterfaces_1.SERVICE_RESPONSES.fetchDataError };
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from getWalletByUserId service: ', error.message) : console.log('Unknown error from getWalletByUserId service: ', error);
                return { success: false, message: walletInterfaces_1.SERVICE_RESPONSES.commonError };
            }
        });
    }
    deleteWalletById(walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteWallet = yield this.walletRepository.deleteWallet(walletId);
                console.log('deleteWalletById service response: ', deleteWallet);
                return deleteWallet ? { success: true, data: deleteWallet, message: walletInterfaces_1.SERVICE_RESPONSES.deleteWalletSuccess } : { success: false, message: walletInterfaces_1.SERVICE_RESPONSES.deleteWalletError };
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from deleteWalletById service: ', error.message) : console.log('Unknown error from deleteWalletById service: ', error);
                return { success: false, message: walletInterfaces_1.SERVICE_RESPONSES.commonError };
            }
        });
    }
    updateWalletById(walletId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { amount, type } = data;
                const userWallet = yield this.walletRepository.getWalletById(walletId);
                let newAmount = 0;
                if (userWallet) {
                    newAmount = userWallet.amount + amount;
                }
                let transaction = {
                    type,
                    amount
                };
                const updateWallet = yield this.walletRepository.updateWallet(walletId, { $set: { amount: newAmount }, $push: { transactions: transaction } });
                console.log('updateWalletById service response: ', updateWallet);
                return updateWallet ? { success: true, data: updateWallet, message: walletInterfaces_1.SERVICE_RESPONSES.updateWalletSuccess } : { success: false, message: walletInterfaces_1.SERVICE_RESPONSES.updateWalletError };
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from updateWalletById service: ', error.message) : console.log('Unknown error from updateWalletById service: ', error);
                return { success: false, message: walletInterfaces_1.SERVICE_RESPONSES.commonError };
            }
        });
    }
    createWallet(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newWallet = yield this.walletRepository.createWallet(data);
                console.log('createWallet service response: ', newWallet);
                return newWallet ? { success: true, data: newWallet, message: walletInterfaces_1.SERVICE_RESPONSES.addWalletSuccess } : { success: false, message: walletInterfaces_1.SERVICE_RESPONSES.addWalletError };
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from createWallet service: ', error.message) : console.log('Unknown error from createWallet service: ', error);
                return { success: false, message: walletInterfaces_1.SERVICE_RESPONSES.commonError };
            }
        });
    }
}
exports.WalletService = WalletService;
