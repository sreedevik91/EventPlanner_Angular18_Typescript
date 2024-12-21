
import jwt, { JwtPayload } from 'jsonwebtoken'
import { config } from 'dotenv'
import { Request, Response, NextFunction } from 'express'
import { match } from 'path-to-regexp'
import { getUserByIdGrpcGateway } from '../grpc/grpcUserGatewayClient'


config()

interface CustomRequest extends Request {
    user?: string | JwtPayload
}

const verifyToken = async (req: CustomRequest, res: Response, next: NextFunction) => {

    console.log('entered token verification ');
    console.log('Request Headers:', req.headers);
    console.log('Cookies:', req.cookies);

    // const publicRoutes = [
    //     '/user/verifyEmail',
    //     '/user/login',
    //     '/user/register',
    //     '/user/sendResetEmail',
    //     '/user/resetPassword',
    //     '/user/verifyOtp',
    //     '/user/sendOtp/:id',
    //     '/user/refreshToken',
    //     '/user/logout',
    // ]



    const publicRoutes = [
        '/',
        '/verifyEmail',
        '/login',
        '/register',
        '/sendResetEmail',
        '/resetPassword',
        '/verifyOtp',
        '/sendOtp/:id',
        '/refreshToken',
        '/logout',
    ]


    // let urlPath: string = req.path
    console.log('Incoming Request Path:', req.path);
    const isPublicRoute = (urlPath: string) => {
        return publicRoutes.some(route => {
            let matchValue = match(route, { decode: decodeURIComponent })
            console.log(`Matching "${urlPath}" with "${route}"`);
            const result= matchValue(urlPath)
            console.log('Match Result:', result);
            return result !== false;
        })
    }
    console.log('isPublicRoute', isPublicRoute(req.path));

    if (isPublicRoute(req.path)) {
        next()
    } else {
        const token = req.cookies?.accessToken

        console.log('cookie token: ', token);


        if (!token) {
            res.status(401).json({ success: false, message: 'Unauthorized: Token Missing' })
            return
        }
        try {
            const decoded = <JwtPayload>jwt.verify(token, process.env.JWT_ACCESS_SECRET!)
            console.log('decoded token: ', decoded);

            const userId = decoded.id

            const user=await getUserByIdGrpcGateway(userId)
            console.log('user from gateway: ', user);
            

            if (!user.isActive) {
                res.status(403).json({ success: false, message: 'Account is blocked' })
                return
            }

            req.user = decoded

            next()

        } catch (error: any) {

            console.log('token middleware error: ', error);

            if (error.name === 'TokenExpiredError') {
                res.status(401).json({ success: false, message: 'Token Expired' })
                return
            }

            res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' })
        }
    }



}


export default verifyToken
