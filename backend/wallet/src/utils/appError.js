"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
const walletInterfaces_1 = require("../interfaces/walletInterfaces");
class AppError extends Error {
    constructor(responseData) {
        super(responseData.message || walletInterfaces_1.CONTROLLER_RESPONSES.commonError);
        this.responseData = responseData;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
