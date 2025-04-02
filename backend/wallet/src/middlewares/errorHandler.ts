import { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/appError"
import { ResponseHandler } from "./responseHandler";
import { CONTROLLER_RESPONSES, HttpStatusCodes } from "../interfaces/walletInterfaces";

export const errorHandler = (error: AppError, req: Request, res: Response, next: NextFunction) => {

    console.log('Errors: ', error, error.stack);

    const responseData = error.responseData

    if (error instanceof AppError) {

        ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, responseData)
    }

    ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: CONTROLLER_RESPONSES.commonError })

}