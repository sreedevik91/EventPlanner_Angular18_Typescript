import { CookieType } from "../interfaces/userInterface";
import { Request, Response } from 'express'
import UserServices from "../services/userServices";
import { log } from "console";

class UserController {

    async registerUser(req: Request, res: Response) {
        try {
            const isUser = await UserServices.register(req.body)
            console.log('response from register user: ', isUser);

            isUser?.success ? res.status(201).json(isUser) : res.status(400).json(isUser)


        } catch (error: any) {
            console.log('Error from Register User: ', error.message);
            res.status(500).json(error.message)
        }
    }

    async googleLogin(req: Request, res: Response) {
        try {
            // console.log('google user: ', req.user);

            if (req.user) {
                const login = await UserServices.login(req.user)
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
            res.status(200).json({ success: true, data: user })
        } catch (error: any) {
            console.log('Error from getGoogleUser: ', error.message);
            res.status(500).json({ success: true, message: error.message })
        }

    }


    async userLogin(req: Request, res: Response) {
        try {
            const login = await UserServices.login(req.body)
            if (login) {
                if (login.emailVerified) {
                    if (login.success && login.cookieData) {
                        const cookie: CookieType = login.cookieData
                        // console.log('login cookie data: ',cookie);
                        const { payload, refreshToken, accessToken, options } = cookie
                        res.cookie('refreshToken', refreshToken, options)
                        res.cookie('accessToken', accessToken, options)
                        res.status(200).json({ success: true, emailVerified: true, message: 'Logged in success', data: payload })

                        console.log('sending login response from  controller to frontend: login success emailVerified success fail');

                    } else {

                        res.status(400).json({ success: false, emailVerified: true, message: 'User not found.Invalid username or password' })
                        console.log('sending login response from  controller to frontend: login fail emailVerified success fail');

                    }
                } else {

                    res.status(400).json({ success: false, emailVerified: false, message: 'Email not verified' })
                    console.log('sending login response from  controller to frontend: login fail emailNotVerified success fail');

                }

            }

        } catch (error: any) {
            console.log('Error from Login User: ', error.message);
            res.status(500).json({ success: false, message: error.message })
        }
    }

    async sendResetEmail(req: Request, res: Response) {
        try {
            console.log(req.body.email);
            const response = await UserServices.sendResetPasswordEmail(req.body.email)
            console.log("sendMail: ", response);
            response?.success ? res.status(200).json(response) : res.status(400).json(response)

        } catch (error: any) {
            console.log('Error from send email to user: ', error.message);
            res.status(500).json(error.message)
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            console.log('resetPassword data from req body:', req.body);

            const response = await UserServices.resetUserPassword(req.body)
            // console.log('reset password response: ', response);
            response?.success ? res.status(200).json(response) : res.status(400).json(response)

        } catch (error: any) {
            console.log('Error from reset password : ', error.message);
            res.status(500).json(error.message)
        }
    }


    async verifyOtp(req: Request, res: Response) {
        try {
            const response = await UserServices.verifyLoginOtp(req.body)
            response?.success ? res.status(200).json(response) : res.status(400).json(response)

        } catch (error: any) {
            console.log('Error from verify otp : ', error.message);
            res.status(500).json(error.message)
        }
    }

    async resendOtp(req: Request, res: Response) {
        try {
            const id = req.params.id
            console.log("id to resend otp: ", id);

            const response = await UserServices.resendUserOtp(req.params.id)
            response?.success ? res.status(200).json(response) : res.status(400).json(response)

        } catch (error: any) {
            console.log('Error from resend otp : ', error.message);
            res.status(500).json(error.message)
        }
    }

    async userLogout(req: Request, res: Response) {
        try {
            res.clearCookie('accessToken')
            res.clearCookie('refreshToken')
            res.status(200).json({ success: true, message: 'User logged out' })
        } catch (error:any) {
            res.status(500).json(error.message)
        }
    }

    async getAllUsers(req: Request, res: Response) {

        try {
            let users = await UserServices.getUsers(req.query)
            users?.success ? res.status(200).json(users) : res.status(400).json(users)

        } catch (error: any) {
            console.log('Error from getAllUsers : ', error.message);
            res.status(500).json(error.message)

        }
    }

    async getUsersCount(req: Request, res: Response) {

        try {
            let users = await UserServices.getUsersCount()
            users?.success ? res.status(200).json(users) : res.status(400).json(users)
            
        } catch (error: any) {
            console.log('Error from getUsersCount : ', error.message);
            res.status(500).json(error.message)

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
            let tokenRes: any = await UserServices.getNewToken(refreshToken)
            const { accessToken, options, payload } = tokenRes
            if (accessToken) {
                res.cookie('accessToken', accessToken, options)
                res.cookie('refreshToken', refreshToken, options)
                res.status(200).json({ success: true, message: 'Token refreshed', data: payload })
                return
            }
            res.status(400).json({ success: false, message: 'Token could not refresh' })

        } catch (error: any) {
            console.log('Error from refreshToken : ', error.message);
            res.status(500).json({ success: false, message: 'Token could not refresh' })
        }
    }

    async editUser(req: Request, res: Response) {
        try {
            const { userId } = req.params
            const { data } = req.body
            console.log('user details to update: ', userId, data);

            const newUserResponse = await UserServices.updateUser(userId, data)
            newUserResponse?.success ? res.status(200).json(newUserResponse) : res.status(400).json(newUserResponse)

        } catch (error: any) {
            console.log('Error from edit user : ', error.message);
            res.status(500).json(error.message)

        }
    }

    async editStatus(req: Request, res: Response) {
        try {
            const { id } = req.body
            // console.log('id to edit user',id);

            const newStatusResponse = await UserServices.updateUserStatus(id)
            newStatusResponse?.success ? res.status(200).json(newStatusResponse) : res.status(400).json(newStatusResponse)
          
        } catch (error: any) {
            console.log('Error from edit status : ', error.message);
            res.status(500).json(error.message)

        }
    }

    async getUser(req: Request, res: Response) {
        try {
            const { id } = req.params
            console.log('id to get user', id);

            const userResponse = await UserServices.getUser(id)
            userResponse?.success ? res.status(200).json(userResponse) : res.status(400).json(userResponse)

        } catch (error: any) {
            console.log('Error from get user : ', error.message);
            res.status(500).json(error.message)

        }
    }

    async verifyEmail(req: Request, res: Response) {
        try {
            const { email } = req.body
            console.log('email to verify', req.body.email);
            const verifyEmailResponse = await UserServices.verifyUserEmail(email)
            verifyEmailResponse?.success ? res.status(200).json(verifyEmailResponse) : res.status(400).json({message:'could not send otp to verify email'})

        } catch (error: any) {
            console.log('Error from verify user email : ', error.message);
            res.status(500).json(error.message)

        }
    }

    async verifyUser(req: Request, res: Response) {
        try {
            const { id } = req.body
            console.log('id to verify', req.body.id);
            const verifyUser = await UserServices.verifyUser(id)
            verifyUser?.success ? res.status(200).json(verifyUser) : res.status(400).json(verifyUser)

        } catch (error: any) {
            console.log('Error from verify user : ', error.message);
            res.status(500).json(error.message)

        }
    }
}



export default new UserController()