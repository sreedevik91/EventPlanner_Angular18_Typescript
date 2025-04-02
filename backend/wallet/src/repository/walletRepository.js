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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRepository = void 0;
const walletSchema_1 = __importDefault(require("../models/walletSchema"));
const baseRepository_1 = require("./baseRepository");
class WalletRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(walletSchema_1.default);
    }
    getWalletByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findOne({ userId });
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from WalletRepository: ', error.message) : console.log('Unknown error from WalletRepository: ', error);
                return null;
            }
        });
    }
    updateWalletByUserId(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('update query from updateWalletByUserId repository:', data);
                const updateQuery = {};
                if (data.$set) {
                    updateQuery.$set = data.$set;
                }
                if (data.$push) {
                    updateQuery.$push = data.$push;
                }
                console.log('new update query from updateWalletByUserId repository:', updateQuery);
                return yield this.model.findOneAndUpdate({ userId }, updateQuery, { new: true });
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from wallet Repository: ', error.message) : console.log('Unknown error from wallet Repository: ', error);
                return null;
            }
        });
    }
}
exports.WalletRepository = WalletRepository;
