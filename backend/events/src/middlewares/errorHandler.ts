import { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/appError"
import { CONTROLLER_RESPONSES } from "../interfaces/eventInterfaces";

export const errorHandler = (error: AppError, req: Request, res: Response, next: NextFunction) => {

    console.log('Errors: ', error, error.stack);

    const statusCode = error.status || 500
    const message = error.message || CONTROLLER_RESPONSES.internalServerError

    res.status(statusCode).json({
        success: error.success,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    })

}