
import { Response } from "express";
import { HttpStatusCodes, IResponse } from "../interfaces/eventInterfaces";

export class ResponseHandler {

    static successResponse(res: Response, statusCode: number = HttpStatusCodes.OK, responseData: IResponse) {

        try {
        console.log('sending responde to frontend: ', responseData);
        res.status(statusCode).json(responseData)
        console.log('responde sent to frontend: ', responseData);    
        } catch (error) {
        console.log('error in sending responde to frontend: ', error); 
        }

    }

    static errorResponse(res: Response, statusCode: number = HttpStatusCodes.INTERNAL_SERVER_ERROR, responseData: IResponse) {
        try {
            console.log('sending error response to frontend: ', responseData);
            res.status(statusCode).json(responseData)
            console.log('responde sent to frontend: ', responseData);    
            } catch (error) {
            console.log('error in sending error response to frontend: ', error); 
            }
    }
    
}