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
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class TokenService {
    getAccessToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let secret = process.env.JWT_ACCESS_SECRET;
                const payload = {
                    id: user._id,
                    email: user.email,
                    isActive: user.isActive,
                    isEmailVerified: user.isEmailVerified,
                    isUserVerified: user.isUserVerified,
                    role: user.role,
                    user: user.name,
                    googleId: user.googleId || ''
                };
                let token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '1d' });
                return token;
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from getAccessToken service: ', error.message) : console.log('Unknown error from getAccessToken service: ', error);
                return null;
            }
        });
    }
    getRefreshToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let secret = process.env.JWT_REFRESH_SECRET;
                const payload = {
                    id: user._id,
                    email: user.email,
                    isActive: user.isActive,
                    isEmailVerified: user.isEmailVerified,
                    isUserVerified: user.isUserVerified,
                    role: user.role,
                    user: user.name,
                    googleId: user.googleId || ''
                };
                let token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '10d' });
                return token;
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from getRefreshToken service: ', error.message) : console.log('Unknown error from getRefreshToken service: ', error);
                return null;
            }
        });
    }
    verifyAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let secret = process.env.JWT_ACCESS_SECRET;
                const decoded = jsonwebtoken_1.default.verify(token, secret);
                return decoded;
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from verifyAccessToken service: ', error.message) : console.log('Unknown error from verifyAccessToken service: ', error);
                return null;
            }
        });
    }
    verifyRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let secret = process.env.JWT_REFRESH_SECRET;
                const decoded = jsonwebtoken_1.default.verify(token, secret);
                return decoded;
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from verifyRefreshToken service: ', error.message) : console.log('Unknown error from verifyRefreshToken service: ', error);
                return null;
            }
        });
    }
}
exports.TokenService = TokenService;
