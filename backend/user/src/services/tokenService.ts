import { ITokenService, IJwtPayload, IUserDb } from "../interfaces/userInterface";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export class TokenService implements ITokenService {

    async getAccessToken(user: IUserDb) {
        try {
            let secret = process.env.JWT_ACCESS_SECRET
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
            let token = jwt.sign(payload, secret!, { expiresIn: '1d' })
            return token
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getAccessToken service: ', error.message) : console.log('Unknown error from getAccessToken service: ', error)
            return null
        }

    }
    async getRefreshToken(user: IUserDb) {
        try {
            let secret = process.env.JWT_REFRESH_SECRET
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
            let token = jwt.sign(payload, secret!, { expiresIn: '10d' })
            return token
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getRefreshToken service: ', error.message) : console.log('Unknown error from getRefreshToken service: ', error)
            return null
        }

    }

    async verifyAccessToken(token: string) {
        try {
            let secret = process.env.JWT_ACCESS_SECRET
            const decoded = jwt.verify(token, secret!) as IJwtPayload
            return decoded as IJwtPayload
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from verifyAccessToken service: ', error.message) : console.log('Unknown error from verifyAccessToken service: ', error)
            return null
        }
    }


    async verifyRefreshToken(token: string) {
        try {
            let secret = process.env.JWT_REFRESH_SECRET
            const decoded = jwt.verify(token, secret!) as IJwtPayload
            return decoded as IJwtPayload
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from verifyRefreshToken service: ', error.message) : console.log('Unknown error from verifyRefreshToken service: ', error)
            return null
        }
    }
}