import { CONTROLLER_RESPONSES, IResponse } from "../interfaces/bookingInterfaces"

export class AppError extends Error {

    // status: number
    responseData: IResponse
    isOperational: boolean

    // constructor(responseData: IResponse, statusCode:number) {}

    constructor(responseData: IResponse) {

        super(responseData.message || CONTROLLER_RESPONSES.commonError)

        // this.status = statusCode
        this.responseData = responseData
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)
    }
}
