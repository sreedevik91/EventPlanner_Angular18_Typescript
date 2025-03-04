import { CookieOptions, Response } from "express";
import { HttpStatusCodes, ICookie, IResponse } from "../interfaces/userInterface";
import redisClient from "../../../../redis/redisClient"

export class ResponseHandler {

    static successResponse(res: Response, statusCode: number = HttpStatusCodes.SUCCESS, responseData: IResponse, cookieData?: ICookie) {

        if (cookieData) {
            const { refreshToken, accessToken, options } = cookieData
            res.cookie('refreshToken', refreshToken, options)
            res.cookie('accessToken', accessToken, options)
        }

        res.status(statusCode).json(responseData)
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

    static async logoutResponse(res: Response, token: string, expTime: number, statusCode: number = HttpStatusCodes.SUCCESS, responseData: IResponse) {

        const options: CookieOptions = {
            httpOnly: true,
            // maxAge: 86400,
            secure: process.env.NODE_ENV === 'production', // secure will become true when the app is running in production
            // sameSite:'none'
        }

        try {
            const expirationTime = expTime * 1000
            const currentTime = Date.now()

            if (expirationTime > currentTime) {
                const ttl = expirationTime - currentTime
                await redisClient.set(`blackList:${token}`, 'true', { PX: ttl })
                console.log('token blacklisted in redis');
                
            }

            res.clearCookie('accessToken', options)
            res.clearCookie('refreshToken', options)
            res.status(statusCode).json(responseData)
        } catch (error) {
            res.clearCookie('accessToken', options)
            res.clearCookie('refreshToken', options)
            res.status(statusCode).json(responseData)
        }


    }

}