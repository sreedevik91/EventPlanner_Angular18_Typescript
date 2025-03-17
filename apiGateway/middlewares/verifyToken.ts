
import { JwtPayload, verify } from 'jsonwebtoken'
import { config } from 'dotenv'
import { Request, Response, NextFunction } from 'express'
import { match } from 'path-to-regexp'
import { getUserByIdGrpcGateway } from '../grpc/grpcUserGatewayClient'

import redisClient from './redisClient'

config()

interface CustomRequest extends Request {
    user?: string | JwtPayload
}

const verifyToken = async (req: CustomRequest, res: Response, next: NextFunction) => {

    console.log('[Docker] Full Request URL:', req.originalUrl); // 👈 Log full URL
    console.log('[Docker] req.path:', req.path); // 👈 Critical for debugging

    console.log('[Gateway] Incoming request to:', req.originalUrl);
    console.log('[Gateway] Headers:', req.headers);
    console.log('[Gateway] Cookies:', req.cookies);

    // Allow OPTIONS requests to bypass token checks
    if (req.method === 'OPTIONS') {
        next();
        return;
    }

    console.log('entered token verification ');
    console.log('Request Headers:', req.headers);
    console.log('Cookies:', req.cookies);

    // const publicRoutes = [
    //     '/',
    //     '/email/verify',
    //     '/login',
    //     '/auth/google',
    //     '/auth/google/callback',
    //     '/register',
    //     '/password/resetEmail',
    //     '/password/reset',
    //     '/otp/verify',
    //     '/otp/:id',
    //     '/token/refresh',
    //     '/logout'
    // ]



    const publicRoutes = [
        '/',
        '/email/verify',
        '/login',
        '/auth/google',
        '/auth/google/callback',
        '/register',
        '/password/resetEmail',
        '/password/reset',
        '/otp/verify',
        '/otp/:id',
        '/token/refresh',
        '/logout',
        '/api/user/login',
        '/api/user/email/verify',
        '/api/user/auth/google',
        '/api/user/auth/google/callback',
        '/api/user/register',
        '/api/user/password/resetEmail',
        '/api/user/password/reset',
        '/api/user/otp/verify',
        '/api/user/otp/:id',
        '/api/user/token/refresh',
        '/api/user/logout'
    ]


    // let urlPath: string = req.path
    console.log('Incoming Request Path:', req.path);
    const isPublicRoute = (urlPath: string) => {
        // Normalize path
        const normalizedPath = urlPath.startsWith('/api/user')
            ? urlPath.replace('/api/user', '')
            : urlPath;
        return publicRoutes.some(route => {
            let matchValue = match(route, { decode: decodeURIComponent })
            console.log(`Matching "${normalizedPath}" with "${route}"`);
            const result = matchValue(normalizedPath)
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

            // Check blacklist first
            // const isBlacklisted = await redisClient.get(`blacklist:${token}`);
            // if (isBlacklisted) {
            //     console.log('Token blocklisted');
            //     res.status(401).json({ success: false, message: 'Token revoked' });
            //     return
            // }
            try {
                const isBlacklisted = await redisClient.get(`blacklist:${token}`);
                if (isBlacklisted) {
                    console.log('Token blocklisted');
                    res.status(401).json({ success: false, message: 'Token revoked' });
                    return
                }
            } catch (error) {
                console.error('Redis error:', error);
            }

            // Verify JWT
            const decoded = <JwtPayload>verify(token, process.env.JWT_ACCESS_SECRET!)
            console.log('decoded token: ', decoded);

            const userId = decoded.id

            const user = await getUserByIdGrpcGateway(userId)
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
