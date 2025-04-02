
import { Response } from "express";
import { HttpStatusCodes, IResponse } from "../interfaces/walletInterfaces";

export class ResponseHandler {

    static successResponse(res: Response, statusCode: number = HttpStatusCodes.OK, responseData: IResponse) {

        try {
            res.status(statusCode).json(responseData)
        } catch (error) {
            console.log('error in sending responde to frontend: ', error);
        }

    }

    static errorResponse(res: Response, statusCode: number = HttpStatusCodes.INTERNAL_SERVER_ERROR, responseData: IResponse) {

        try {
            res.status(statusCode).json(responseData)
        } catch (error) {
            console.log('error in sending error response to frontend: ', error);
        }

    }

}