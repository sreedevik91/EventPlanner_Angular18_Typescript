import { CookieOptions, Response, Request } from "express";
import { HttpStatusCodes, ICookie, IResponse } from "../interfaces/userInterface";
import redisClient from "../middlewares/redisClient";

export class ResponseHandler {

    static successResponse(res: Response, statusCode: number = HttpStatusCodes.OK, responseData: IResponse, cookieData?: ICookie) {

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
        console.log('Response headers:', res.getHeaders());
        console.log('Cookies set:', { refreshToken, accessToken, options }, res.cookie);
        // res.redirect('/googleLogin/callback')

        // Set Location header and send 302 manually
        // res.set('Location', '/googleLogin/callback');
        res.set('Location', 'https://dreamevents.shop/googleLogin/callback');
        res.status(302).end(); // Ensure redirect with cookies

    }

    static async logoutResponse(req: Request, res: Response, token: string, expTime: number, statusCode: number = HttpStatusCodes.OK, responseData: IResponse) {

        const options: CookieOptions = {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production', // secure will become true when the app is running in production
            secure: process.env.NODE_ENV === 'production' ? req.protocol === 'https' : false,
            sameSite: 'lax', // Required for cross-origin cookies
            ...(process.env.NODE_ENV === 'production' && { domain: 'dreamevents.shop' }) // only set in prod

        }

        try {
            const expirationTime = expTime * 1000
            const currentTime = Date.now()

            if (expirationTime > currentTime) {
                const ttl = expirationTime - currentTime
                const blacklist = await redisClient.set(`blackList:${token}`, 'true', { PX: ttl })
                console.log('token blacklisted in redis:', blacklist, await redisClient.get(`blackList:${token}`));
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