
import jwt, { JwtPayload } from 'jsonwebtoken'
import { config } from 'dotenv'
import { Request, Response, NextFunction } from 'express'

config()

interface CustomRequest extends Request {
    user?: string | JwtPayload
}

const verifyToken = async (req: CustomRequest, res: Response, next: NextFunction) => {

    console.log('entered token verification ');
    console.log('Request Headers:', req.headers);
    console.log('Cookies:', req.cookies);

    const token = req.cookies?.accessToken

    console.log('cookie token: ', token);


    if (!token) {
        res.status(401).json({ success: false, message: 'Unauthorized: Token Missing' })
        return
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!)
        console.log('decoded token: ', decoded);

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


export default verifyToken
