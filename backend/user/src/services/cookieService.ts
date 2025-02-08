import { CookieOptions } from "express";
import { ICookieService, IJwtPayload, IUserDb } from "../interfaces/userInterface";

export class CookieService implements ICookieService {

    async getCookieOptions(user: IUserDb, accessToken: string, refreshToken: string) {

        const payload: IJwtPayload = {
            id: user._id,
            email: user.email,
            isActive: user.isActive,
            isEmailVerified: user.isEmailVerified,
            isUserVerified: user.isUserVerified,
            role: user.role,
            user: user.name,
            googleId: user.googleId || ''
        }

        const options: CookieOptions = {
            httpOnly: true,
            // maxAge: 86400,
            secure: process.env.NODE_ENV === 'production', // secure will become true when the app is running in production
            // sameSite:'none'
        }
        return { payload, accessToken, refreshToken, options }

    }
}