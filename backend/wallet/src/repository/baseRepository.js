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
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    createWallet(WalletData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = new this.model(WalletData);
                return yield wallet.save();
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from Wallet BaseRepository: ', error.message) : console.log('Unknown error from Wallet BaseRepository: ', error);
                return null;
            }
        });
    }
    getWalletById(walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findById(walletId);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from wallet BaseRepository: ', error.message) : console.log('Unknown error from wallet BaseRepository: ', error);
                return null;
            }
        });
    }
    updateWallet(walletId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateQuery = {};
                if (data.$set) {
                    updateQuery.$set = data.$set;
                }
                else if (data.$push) {
                    updateQuery.$push = data.$push;
                }
                return yield this.model.findOneAndUpdate({ _id: walletId }, updateQuery, { new: true });
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from wallet BaseRepository: ', error.message) : console.log('Unknown error from wallet BaseRepository: ', error);
                return null;
            }
        });
    }
    deleteWallet(walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findByIdAndDelete(walletId);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from wallet BaseRepository: ', error.message) : console.log('Unknown error from wallet BaseRepository: ', error);
                return null;
            }
        });
    }
}
exports.BaseRepository = BaseRepository;
