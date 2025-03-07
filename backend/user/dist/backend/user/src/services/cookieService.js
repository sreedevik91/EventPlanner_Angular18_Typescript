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
exports.CookieService = void 0;
class CookieService {
    getCookieOptions(user, accessToken, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const options = {
                httpOnly: true,
                // maxAge: 86400,
                secure: process.env.NODE_ENV === 'production', // secure will become true when the app is running in production
                // sameSite:'none'
            };
            return { payload, accessToken, refreshToken, options };
        });
    }
}
exports.CookieService = CookieService;
