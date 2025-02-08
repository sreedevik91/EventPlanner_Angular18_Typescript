import { Response } from "express";
import { HttpStatusCodes, ICookie, IResponse } from "../interfaces/userInterface";

export class ResponseHandler {

    static successResponse(res: Response, statusCode: number = HttpStatusCodes.SUCCESS, responseData: IResponse, cookieData?: ICookie) {

        if (cookieData) {
            const { refreshToken, accessToken, options } = cookieData
            res.cookie('refreshToken', refreshToken, options)
            res.cookie('accessToken', accessToken, options)
        }

        res.status(statusCode).json( responseData)
    }

    static errorResponse(res: Response, statusCode: number = HttpStatusCodes.INTERNAL_SERVER_ERROR, responseData: IResponse) {
        res.status(statusCode).json(responseData)
    }

    static googleResponse(res: Response, cookieData: ICookie) {
        const { refreshToken, accessToken, options } = cookieData
        res.cookie('refreshToken', refreshToken, options)
        res.cookie('accessToken', accessToken, options)
        res.redirect('/googleLogin/callback')
    }

    static logoutResponse(res:Response,statusCode: number = HttpStatusCodes.SUCCESS, responseData: IResponse){
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        res.status(statusCode).json( responseData )
    }

}