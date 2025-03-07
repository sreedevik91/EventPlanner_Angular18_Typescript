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
exports.ResponseHandler = void 0;
const userInterface_1 = require("../interfaces/userInterface");
const redisClient_1 = __importDefault(require("../../../../redis/redisClient"));
class ResponseHandler {
    static successResponse(res, statusCode = userInterface_1.HttpStatusCodes.SUCCESS, responseData, cookieData) {
        if (cookieData) {
            const { refreshToken, accessToken, options } = cookieData;
            res.cookie('refreshToken', refreshToken, options);
            res.cookie('accessToken', accessToken, options);
        }
        res.status(statusCode).json(responseData);
    }
    static errorResponse(res, statusCode = userInterface_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, responseData) {
        res.status(statusCode).json(responseData);
    }
    static googleResponse(res, cookieData) {
        const { refreshToken, accessToken, options } = cookieData;
        res.cookie('refreshToken', refreshToken, options);
        res.cookie('accessToken', accessToken, options);
        res.redirect('/googleLogin/callback');
    }
    static logoutResponse(res_1, token_1, expTime_1) {
        return __awaiter(this, arguments, void 0, function* (res, token, expTime, statusCode = userInterface_1.HttpStatusCodes.SUCCESS, responseData) {
            const options = {
                httpOnly: true,
                // maxAge: 86400,
                secure: process.env.NODE_ENV === 'production', // secure will become true when the app is running in production
                // sameSite:'none'
            };
            try {
                const expirationTime = expTime * 1000;
                const currentTime = Date.now();
                if (expirationTime > currentTime) {
                    const ttl = expirationTime - currentTime;
                    yield redisClient_1.default.set(`blackList:${token}`, 'true', { PX: ttl });
                    console.log('token blacklisted in redis');
                }
                res.clearCookie('accessToken', options);
                res.clearCookie('refreshToken', options);
                res.status(statusCode).json(responseData);
            }
            catch (error) {
                res.clearCookie('accessToken', options);
                res.clearCookie('refreshToken', options);
                res.status(statusCode).json(responseData);
            }
        });
    }
}
exports.ResponseHandler = ResponseHandler;
