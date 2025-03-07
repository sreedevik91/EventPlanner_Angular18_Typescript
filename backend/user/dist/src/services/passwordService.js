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
exports.PasswordService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class PasswordService {
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = yield bcryptjs_1.default.hash(password, yield bcryptjs_1.default.genSalt(10));
                return hashedPassword;
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from hashPassword service: ', error.message) : console.log('Unknown error from hashPassword service: ', error);
                return null;
            }
        });
    }
    verifyPassword(inputPassword, userPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isPAsswordMatch = yield bcryptjs_1.default.compare(inputPassword, userPassword);
                console.log('isPAsswordMatch: ', isPAsswordMatch);
                return isPAsswordMatch;
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from verifyPassword service: ', error.message) : console.log('Unknown error from verifyPassword service: ', error);
                return null;
            }
        });
    }
}
exports.PasswordService = PasswordService;
