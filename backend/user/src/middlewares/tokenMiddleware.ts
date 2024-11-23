
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
    console.log('Cookies:',req.cookies);

    const token = req.cookies?.accessToken

    console.log('cookie token: ', token);


    if (!token) {
        res.status(404).json({ success: false, message: 'Unauthorized' })
        return
    }
    try {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!)
            console.log('decoded token: ', decoded);

            req.user = decoded
            next()

    } catch (error: any) {
        res.json({ success: false, message: error.message })
    }
}


export default verifyToken
