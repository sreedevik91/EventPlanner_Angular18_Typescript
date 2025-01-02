import { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/appError"

export const errorHandler = (error: AppError, req: Request, res: Response, next: NextFunction) => {

    console.log('Errors: ', error.stack);

    const statusCode = error.status || 500
    const message = error.message || 'Internal Server Error'

    res.status(statusCode).json({
        success: error.success,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    })

}