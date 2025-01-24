
export class AppError extends Error {
     status: number
     success: boolean
     isOperational: boolean
    constructor(message: string, statusCode: number) {
        
        super(message)
        this.status = statusCode
        this.success = false

        this.isOperational = true
        Error.captureStackTrace(this, this.constructor)
    }
}
