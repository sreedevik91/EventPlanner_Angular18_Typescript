import { CookieType } from "../interfaces/userInterface";
import { Request, Response } from 'express'
import userServices from "../services/userServices";

class UserController{
      async registerUser (req: Request, res: Response) {
        try {
            const isUser = await userServices.register(req.body)
            res.json(isUser)
    
        } catch (error: any) {
            console.log('Error from Register User: ', error.message);
        }
    }
    
    async userLogin(req: Request, res: Response) {
        try {
            const login = await userServices.login(req.body)
            if (login) {
                if (login.success && login.cookieData) {
                    const cookie:CookieType = login.cookieData
                    const {payload, token, options} = cookie
                    res.cookie('jwtToken', token, options)
                    res.json({ success: true, message: 'Logged in success', userData: payload })
    
                } else {
                    res.json({ success: false, message: 'User not found.Invalid username or password' })
                }
            }
    
        } catch (error: any) {
            console.log('Error from Login User: ', error.message);
        }
    }
    
    async sendResetEmail(req: Request, res: Response){
        try {
            console.log(req.body.email);
            const response = await userServices.sendResetPasswordEmail(req.body.email)
            console.log("sendMail: ", response);
            res.json(response)
        } catch (error: any) {
            console.log('Error from send email to user: ', error.message);
        }
    }
    
    async resetPassword(req: Request, res: Response){
        try {
            // console.log(req.body);
    
            const response = await userServices.resetUserPassword(req.body)
            // console.log('reset password response: ', response);
            res.json(response)
        } catch (error: any) {
            console.log('Error from reset password : ', error.message);
        }
    }
    
    
    async verifyOtp(req: Request, res: Response){
        try {
            const response = await userServices.verifyLoginOtp(req.body)
            res.json(response)
        } catch (error: any) {
            console.log('Error from verify otp : ', error.message);
        }
    }
    
    async resendOtp(req: Request, res: Response){
        try {
            const id = req.params.id
            console.log("id to resend otp: ", id);
    
            const response = await userServices.resendUserOtp(req.params.id)
            res.json(response)
        } catch (error: any) {
            console.log('Error from resend otp : ', error.message);
        }
    }
    
    async userLogout(req: Request, res: Response){
        res.clearCookie('jwtToken')
        res.json({ success: true, message: 'User logged out' })
    }
}



export const userController= new UserController()