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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const path_to_regexp_1 = require("path-to-regexp");
const grpcUserGatewayClient_1 = require("../grpc/grpcUserGatewayClient");
const redisClient_1 = __importDefault(require("../../redis/redisClient"));
(0, dotenv_1.config)();
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('entered token verification ');
    console.log('Request Headers:', req.headers);
    console.log('Cookies:', req.cookies);
    const publicRoutes = [
        '/',
        '/email/verify',
        '/login',
        '/auth/google',
        '/auth/google/callback',
        '/register',
        '/password/resetEmail',
        '/password/reset',
        '/otp/verify',
        '/otp/:id',
        '/token/refresh',
        '/logout',
    ];
    // let urlPath: string = req.path
    console.log('Incoming Request Path:', req.path);
    const isPublicRoute = (urlPath) => {
        return publicRoutes.some(route => {
            let matchValue = (0, path_to_regexp_1.match)(route, { decode: decodeURIComponent });
            console.log(`Matching "${urlPath}" with "${route}"`);
            const result = matchValue(urlPath);
            console.log('Match Result:', result);
            return result !== false;
        });
    };
    console.log('isPublicRoute', isPublicRoute(req.path));
    if (isPublicRoute(req.path)) {
        next();
    }
    else {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
        console.log('cookie token: ', token);
        if (!token) {
            res.status(401).json({ success: false, message: 'Unauthorized: Token Missing' });
            return;
        }
        try {
            // Check blacklist first
            const isBlacklisted = yield redisClient_1.default.get(`blacklist:${token}`);
            if (isBlacklisted) {
                console.log('Token blocklisted');
                res.status(401).json({ success: false, message: 'Token revoked' });
                return;
            }
            // Verify JWT
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
            console.log('decoded token: ', decoded);
            const userId = decoded.id;
            const user = yield (0, grpcUserGatewayClient_1.getUserByIdGrpcGateway)(userId);
            console.log('user from gateway: ', user);
            if (!user.isActive) {
                res.status(403).json({ success: false, message: 'Account is blocked' });
                return;
            }
            req.user = decoded;
            next();
        }
        catch (error) {
            console.log('token middleware error: ', error);
            if (error.name === 'TokenExpiredError') {
                res.status(401).json({ success: false, message: 'Token Expired' });
                return;
            }
            res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
        }
    }
});
exports.default = verifyToken;
