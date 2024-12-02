import { CookieType } from "../interfaces/userInterface";
import { Request, Response } from 'express'
import userServices from "../services/userServices";
import { log } from "console";

class UserController {
    async registerUser(req: Request, res: Response) {
        try {
            const isUser = await userServices.register(req.body)
            console.log('response from register user: ', isUser);
            res.json(isUser)

        } catch (error: any) {
            console.log('Error from Register User: ', error.message);
        }
    }

    async googleLogin(req: Request, res: Response) {
        try {
            // console.log('google user: ', req.user);

            if (req.user) {
                const login = await userServices.login(req.user)
                if (login) {
                    if (login.emailVerified) {
                        if (login.success && login.cookieData) {
                            const cookie: CookieType = login.cookieData
                            // console.log('login cookie data: ',cookie);
                            const { payload, refreshToken, accessToken, options } = cookie
                            res.cookie('refreshToken', refreshToken, options)
                            res.cookie('accessToken', accessToken, options)
                            res.redirect('/googleLogin/callback')
                            console.log('sending login response from  controller to frontend: login success emailVerified success fail');

                        } else {
                            console.log('sending login response from  controller to frontend: login fail emailVerified success fail');

                        }
                    } else {
                        console.log('sending login response from  controller to frontend: login fail emailNotVerified success fail');

                    }

                }

            } else {
                console.log('No google user found');
            }

        } catch (error: any) {
            console.log('Error from Login User: ', error.message);
        }
    }


    async getGoogleUser(req: Request, res: Response) {
        try {
            let user = req.user
            console.log('google user data from token: ', user);
            res.json({ success: true, data: user })    
        } catch (error: any) {
            console.log('Error from getGoogleUser: ', error.message);
        }
      
    }


    async userLogin(req: Request, res: Response) {
        try {
            const login = await userServices.login(req.body)
            if (login) {
                if (login.emailVerified) {
                    if (login.success && login.cookieData) {
                        const cookie: CookieType = login.cookieData
                        // console.log('login cookie data: ',cookie);
                        const { payload, refreshToken, accessToken, options } = cookie
                        res.cookie('refreshToken', refreshToken, options)
                        res.cookie('accessToken', accessToken, options)
                        res.json({ success: true, emailVerified: true, message: 'Logged in success', data: payload })

                        console.log('sending login response from  controller to frontend: login success emailVerified success fail');

                    } else {

                        res.json({ success: false, emailVerified: true, message: 'User not found.Invalid username or password' })
                        console.log('sending login response from  controller to frontend: login fail emailVerified success fail');

                    }
                } else {

                    res.json({ success: false, emailVerified: false, message: 'Email not verified' })
                    console.log('sending login response from  controller to frontend: login fail emailNotVerified success fail');

                }

            }

        } catch (error: any) {
            console.log('Error from Login User: ', error.message);
        }
    }

    async sendResetEmail(req: Request, res: Response) {
        try {
            console.log(req.body.email);
            const response = await userServices.sendResetPasswordEmail(req.body.email)
            console.log("sendMail: ", response);
            res.json(response)
        } catch (error: any) {
            console.log('Error from send email to user: ', error.message);
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            console.log('resetPassword data from req body:', req.body);

            const response = await userServices.resetUserPassword(req.body)
            // console.log('reset password response: ', response);
            res.json(response)
        } catch (error: any) {
            console.log('Error from reset password : ', error.message);
        }
    }


    async verifyOtp(req: Request, res: Response) {
        try {
            const response = await userServices.verifyLoginOtp(req.body)
            res.json(response)
        } catch (error: any) {
            console.log('Error from verify otp : ', error.message);
        }
    }

    async resendOtp(req: Request, res: Response) {
        try {
            const id = req.params.id
            console.log("id to resend otp: ", id);

            const response = await userServices.resendUserOtp(req.params.id)
            res.json(response)
        } catch (error: any) {
            console.log('Error from resend otp : ', error.message);
        }
    }

    async userLogout(req: Request, res: Response) {
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        res.json({ success: true, message: 'User logged out' })
    }

    async getAllUsers(req: Request, res: Response) {

        try {
            let users = await userServices.getUsers(req.query)
            res.json(users)
        } catch (error: any) {
            console.log('Error from getAllUsers : ', error.message);
        }
    }

    async getUsersCount(req: Request, res: Response) {

        try {
            let users = await userServices.getUsersCount()
            res.json(users)
        } catch (error: any) {
            console.log('Error from getUsersCount : ', error.message);
        }
    }

    async refreshToken(req: Request, res: Response) {
        try {
            let refreshToken = req.cookies?.refreshToken
            console.log('refreshToken: ', refreshToken);
            if (!refreshToken) {
                res.json({ success: false, message: 'Refresh Token is missing' })
                return
            }
            let tokenRes: any = await userServices.getNewToken(refreshToken)
            const { accessToken, options, payload } = tokenRes
            if (accessToken) {
                res.cookie('accessToken', accessToken, options)
                res.cookie('refreshToken', refreshToken, options)
                res.json({ success: true, message: 'Token refreshed', data: payload })
                return
            }
            res.json({ success: false, message: 'Token could not refresh' })

        } catch (error: any) {
            console.log('Error from refreshToken : ', error.message);
        }
    }

    async editUser(req: Request, res: Response) {
        try {
            const { userId } = req.params
            const { data } = req.body
            console.log('user details to update: ', userId, data);

            const newUserResponse = await userServices.updateUser(userId, data)
            res.json(newUserResponse)
        } catch (error: any) {
            console.log('Error from edit user : ', error.message);
        }
    }

    async editStatus(req: Request, res: Response) {
        try {
            const { id } = req.body
            // console.log('id to edit user',id);

            const newStatusResponse = await userServices.updateUserStatus(id)
            res.json(newStatusResponse)
        } catch (error: any) {
            console.log('Error from edit status : ', error.message);
        }
    }

    async getUser(req: Request, res: Response) {
        try {
            const { id } = req.params
            console.log('id to get user', id);

            const userResponse = await userServices.getUser(id)
            res.json(userResponse)
        } catch (error: any) {
            console.log('Error from get user : ', error.message);
        }
    }

    async verifyEmail(req: Request, res: Response) {
        try {
            const { email } = req.body
            console.log('email to verify', req.body.email);
            const verifyEmailResponse = await userServices.verifyUserEmail(email)
            res.json(verifyEmailResponse)
        } catch (error: any) {
            console.log('Error from verify user email : ', error.message);
        }
    }
}



export const userController = new UserController()