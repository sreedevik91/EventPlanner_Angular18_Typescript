"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const appError_1 = require("../utils/appError");
const responseHandler_1 = require("./responseHandler");
const walletInterfaces_1 = require("../interfaces/walletInterfaces");
const errorHandler = (error, req, res, next) => {
    console.log('Errors: ', error, error.stack);
    const responseData = error.responseData;
    if (error instanceof appError_1.AppError) {
        responseHandler_1.ResponseHandler.errorResponse(res, walletInterfaces_1.HttpStatusCodes.BAD_REQUEST, responseData);
    }
    responseHandler_1.ResponseHandler.errorResponse(res, walletInterfaces_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: walletInterfaces_1.CONTROLLER_RESPONSES.commonError });
};
exports.errorHandler = errorHandler;
