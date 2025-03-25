import { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/appError"
import { ResponseHandler } from "../utils/responseHandler";
import { CONTROLLER_RESPONSES, HttpStatusCodes } from "../interfaces/userInterface";

export const errorHandler = (error: AppError, req: Request, res: Response, next: NextFunction) => {

    console.log('Errors: ', error, error.stack);

    const responseData = error.responseData
    const status=error.statusCode

    if (error instanceof AppError) {

        ResponseHandler.errorResponse(res, status || HttpStatusCodes.BAD_REQUEST, responseData)
    }

    ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: CONTROLLER_RESPONSES.commonError })

}