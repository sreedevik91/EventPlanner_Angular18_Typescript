"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHandler = void 0;
const walletInterfaces_1 = require("../interfaces/walletInterfaces");
class ResponseHandler {
    static successResponse(res, statusCode = walletInterfaces_1.HttpStatusCodes.OK, responseData) {
        try {
            res.status(statusCode).json(responseData);
        }
        catch (error) {
            console.log('error in sending responde to frontend: ', error);
        }
    }
    static errorResponse(res, statusCode = walletInterfaces_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, responseData) {
        try {
            res.status(statusCode).json(responseData);
        }
        catch (error) {
            console.log('error in sending error response to frontend: ', error);
        }
    }
}
exports.ResponseHandler = ResponseHandler;
