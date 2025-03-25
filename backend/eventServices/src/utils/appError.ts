
import { CONTROLLER_RESPONSES, IResponse } from "../interfaces/serviceInterfaces"

export class AppError extends Error {

    responseData: IResponse
    isOperational: boolean

    constructor(responseData: IResponse) {

        super(responseData.message || CONTROLLER_RESPONSES.commonError)

        this.responseData = responseData
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)
    }
}

