"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHandler = void 0;
const eventInterfaces_1 = require("../interfaces/eventInterfaces");
class ResponseHandler {
    // static successResponse(res: Response, statusCode: number = HttpStatusCodes.SUCCESS, responseData: IResponse) {
    //     res.status(statusCode).json(responseData)
    // }
    // static errorResponse(res: Response, statusCode: number = HttpStatusCodes.INTERNAL_SERVER_ERROR, responseData: IResponse) {
    //     res.status(statusCode).json(responseData)
    // }
    static successResponse(res, statusCode = eventInterfaces_1.HttpStatusCodes.OK, responseData) {
        try {
            console.log('sending responde to frontend: ', responseData);
            res.status(statusCode).json(responseData);
            console.log('responde sent to frontend: ', responseData);
        }
        catch (error) {
            console.log('error in sending responde to frontend: ', error);
        }
    }
    static errorResponse(res, statusCode = eventInterfaces_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, responseData) {
        try {
            console.log('sending error response to frontend: ', responseData);
            res.status(statusCode).json(responseData);
            console.log('responde sent to frontend: ', responseData);
        }
        catch (error) {
            console.log('error in sending error response to frontend: ', error);
        }
    }
}
exports.ResponseHandler = ResponseHandler;
