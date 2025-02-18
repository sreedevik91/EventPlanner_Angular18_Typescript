import { HttpStatusCodes, ICookie, IResponse, IUserController, IUserService, LoginData } from "../interfaces/userInterface";
import { Request, Response } from 'express'
import { ResponseHandler } from "../utils/responseHandler";
// import UserService from "../services/userServices";

export class UserController implements IUserController {

    constructor(private userService: IUserService) { }

    async registerUser(req: Request, res: Response) {
        try {
            const isUser = await this.userService.register(req.body)
            console.log('response from register user: ', isUser);

            // isUser?.success ? res.status(201).json(isUser) : res.status(400).json(isUser)
            isUser?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.CREATED, isUser) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, isUser)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from registerUser controller: ', error.message) : console.log('Unknown error from registerUser controller: ', error)
            // res.status(500).json(error.message)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' })
        }
    }

    async googleLogin(req: Request, res: Response) {
        try {
            // console.log('google user: ', req.user);

            if (req.user) {
                const login = await this.userService.login(req.user)
                if (login) {
                    if (login.emailVerified) {
                        if (login.success && login.cookieData) {
                            const cookie: ICookie = login.cookieData
                            // console.log('login cookie data: ',cookie);

                            // const { payload, refreshToken, accessToken, options } = cookie
                            // res.cookie('refreshToken', refreshToken, options) 
                            // res.cookie('accessToken', accessToken, options)
                            // res.redirect('/googleLogin/callback')
                            ResponseHandler.googleResponse(res, cookie)
                            console.log('sending login response from  controller to frontend: login success emailVerified success fail');

                        } else {
                            console.log('sending login response from  controller to frontend: login fail emailVerified success fail');
                            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' })

                        }
                    } else {
                        console.log('sending login response from  controller to frontend: login fail emailNotVerified success fail');
                        ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' })

                    }

                }

            } else {
                console.log('No google user found');
                ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'No google user found' })

            }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from googleLogin controller: ', error.message) : console.log('Unknown error from googleLogin controller: ', error)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' })

        }
    }


    async getGoogleUser(req: Request, res: Response) {
        try {
            let user: LoginData | undefined = req.user
            console.log('google user data from token: ', user);

            if (!user?.email) {
                ResponseHandler.errorResponse(res, HttpStatusCodes.NOT_FOUND, { success: false, message: 'User not found !' })
            } else {
                let userDb = await this.userService.getGoogleUser(user?.email)
                // res.status(200).json({ success: true, data: user })
                // userDb?.success ? res.status(200).json(userDb) : res.status(400).json(userDb)
                userDb?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.SUCCESS, userDb) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, userDb)
            }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getGoogleUser controller: ', error.message) : console.log('Unknown error from getGoogleUser controller: ', error)
            // res.status(500).json({ success: true, message: error.message })
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' })

        }

    }


    async userLogin(req: Request, res: Response) {
        try {
            const login = await this.userService.login(req.body)
            if (login) {

                // if (login.emailVerified) {
                //     if (login.success && login.cookieData) {
                //         const cookie: CookieType = login.cookieData
                //         // console.log('login cookie data: ',cookie);
                //         const { payload, refreshToken, accessToken, options } = cookie
                //         res.cookie('refreshToken', refreshToken, options)
                //         res.cookie('accessToken', accessToken, options)
                //         res.status(200).json({ success: true, emailVerified: true, message: 'Logged in success', data: payload })

                //         console.log('sending login response from  controller to frontend: login success emailVerified success fail');

                //     } else {

                //         res.status(400).json({ success: false, emailVerified: true, message: login.message ? login.message : 'User not found.Invalid username or password' })
                //         console.log('sending login response from  controller to frontend: login fail emailVerified success fail');

                //     }
                // } else {

                //     res.status(400).json({ success: false, emailVerified: false, message: 'Email not verified' })
                //     console.log('sending login response from  controller to frontend: login fail emailNotVerified success fail');

                // }

                if (login.success && login.cookieData) {
                    const cookie: ICookie = login.cookieData
                    // console.log('login cookie data: ',cookie);
                    const { payload, refreshToken, accessToken, options } = cookie
                    // res.cookie('refreshToken', refreshToken, options)
                    // res.cookie('accessToken', accessToken, options)
                    // res.status(200).json({ success: true, emailVerified: true, message: 'Logged in success', data: payload })

                    ResponseHandler.successResponse(res, HttpStatusCodes.SUCCESS, { success: true, emailVerified: true, message: 'Logged in success', data: payload }, cookie)
                    console.log('sending login response from  controller to frontend: login success emailVerified success fail');

                } else {
                    let status = HttpStatusCodes.BAD_REQUEST
                    let resData: IResponse = { success: false }
                    if (login.emailNotVerified) {
                        // res.status(400).json({ success: false, emailNotVerified: true, message: 'Email not verified' })
                        resData = { success: false, emailNotVerified: true, message: 'Email not verified' }
                    } else if (login.wrongCredentials) {
                        // res.status(400).json({ success: false, wrongCredentials: true, message: login.message ? login.message : 'Invalid username or password' })
                        resData = { success: false, wrongCredentials: true, message: login.message ? login.message : 'Invalid username or password' }

                    } else if (login.blocked) {
                        // res.status(403).json({ success: false, blocked: true, message: login.message ? login.message : 'Your account has been blocked. Contact admin for more details.' })
                        status = HttpStatusCodes.FORBIDDEN
                        resData = { success: false, blocked: true, message: login.message ? login.message : 'Your account has been blocked. Contact admin for more details.' }

                    } else if (login.noUser) {
                        // res.status(400).json({ success: false, message: login.message ? login.message : 'User not found' })
                        status = HttpStatusCodes.NOT_FOUND
                        resData = { success: false, message: login.message ? login.message : 'User not found' }

                    }

                    ResponseHandler.errorResponse(res, status, resData)

                }

            }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from userLogin controller: ', error.message) : console.log('Unknown error from userLogin controller: ', error)
            // res.status(500).json({ success: false, message: error.message })
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' })
        }
    }

    async sendResetEmail(req: Request, res: Response) {
        try {
            console.log(req.body.email);
            const resetEmailResponse = await this.userService.sendResetPasswordEmail(req.body.email)
            console.log("sendMail: ", resetEmailResponse);
            // resetEmailResponse?.success ? res.status(200).json(resetEmailResponse) : res.status(400).json(resetEmailResponse)
            resetEmailResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.SUCCESS, resetEmailResponse) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, resetEmailResponse)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from sendResetEmail controller: ', error.message) : console.log('Unknown error from sendResetEmail controller: ', error)
            // res.status(500).json(error.message)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' })

        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            console.log('resetPassword data from req body:', req.body);

            const resetPasswordResponse = await this.userService.resetUserPassword(req.body)
            // console.log('reset password response: ', resetPasswordResponse);
            // resetPasswordResponse?.success ? res.status(200).json(resetPasswordResponse) : res.status(400).json(resetPasswordResponse)
            resetPasswordResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.SUCCESS, resetPasswordResponse) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, resetPasswordResponse)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from resetPassword controller: ', error.message) : console.log('Unknown error from resetPassword controller: ', error)
            // res.status(500).json(error.message)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' })

        }
    }


    async verifyOtp(req: Request, res: Response) {
        try {
            const verifyOtpResponse = await this.userService.verifyLoginOtp(req.body)
            // verifyOtpResponse?.success ? res.status(200).json(verifyOtpResponse) : res.status(400).json(verifyOtpResponse)
            verifyOtpResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.SUCCESS, verifyOtpResponse) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, verifyOtpResponse)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from verifyOtp controller: ', error.message) : console.log('Unknown error from verifyOtp controller: ', error)
            // res.status(500).json(error.message)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' })

        }
    }

    async resendOtp(req: Request, res: Response) {
        try {
            const id = req.params.id
            console.log("id to resend otp: ", id);

            const resendOtpResponse = await this.userService.resendUserOtp(req.params.id)
            // resendOtpResponse?.success ? res.status(200).json(resendOtpResponse) : res.status(400).json(resendOtpResponse)
            resendOtpResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.SUCCESS, resendOtpResponse) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, resendOtpResponse)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from resendOtp controller: ', error.message) : console.log('Unknown error from resendOtp controller: ', error)
            // res.status(500).json(error.message)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' })
        }
    }

    async userLogout(req: Request, res: Response) {
        try {
            // res.clearCookie('accessToken')
            // res.clearCookie('refreshToken')
            // res.status(200).json({ success: true, message: 'User logged out' })
            const token= req.cookies?.accessToken
            const userLogoutResponse = await this.userService.userLogout(token)

            userLogoutResponse.success? ResponseHandler.logoutResponse(res,token,userLogoutResponse.data , HttpStatusCodes.SUCCESS, { success: true, message: 'User logged out'}) :  ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, userLogoutResponse)
        } catch (error: unknown) {
            // res.status(500).json(error.message)
            error instanceof Error ? console.log('Error message from userLogout controller: ', error.message) : console.log('Unknown error from userLogout controller: ', error)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' })
        }
    }

    async getAllUsers(req: Request, res: Response) {

        try {
            let users = await this.userService.getUsers(req.query)
            // users?.success ? res.status(200).json(users) : res.status(400).json(users)
            users?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.SUCCESS, users) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, users)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getAllUsers controller: ', error.message) : console.log('Unknown error from getAllUsers controller: ', error)
            // res.status(500).json(error.message)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' })

        }
    }

    async getUsersCount(req: Request, res: Response) {

        try {
            let totalUsers = await this.userService.getUsersCount()
            // totalUsers?.success ? res.status(200).json(totalUsers) : res.status(400).json(totalUsers)
            totalUsers?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.SUCCESS, totalUsers) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, totalUsers)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getUsersCount controller: ', error.message) : console.log('Unknown error from getUsersCount controller: ', error)
            // res.status(500).json(error.message)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' })
        }
    }

    async refreshToken(req: Request, res: Response) {
        try {
            let refreshTokenOld = req.cookies?.refreshToken
            console.log('refreshToken: ', refreshTokenOld);
            if (!refreshTokenOld) {
                // res.json({ success: false, message: 'Refresh Token is missing' })
                ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, { success: false, message: 'Refresh Token is missing' })
                return
            }
            let tokenRes: IResponse = await this.userService.getNewToken(refreshTokenOld)
            const { accessToken, refreshToken, options, payload } = tokenRes
            if (accessToken && refreshToken && options && payload) {
                // res.cookie('accessToken', accessToken, options)
                // res.cookie('refreshToken', refreshToken, options)
                // res.status(200).json({ success: true, message: 'Token refreshed', data: payload })
                let cookieData:ICookie={accessToken,refreshToken,options,payload}
                ResponseHandler.successResponse(res, HttpStatusCodes.SUCCESS, { success: true, message: 'Token refreshed', data: payload }, cookieData)
                return
            }
            // res.status(400).json({ success: false, message: 'Token could not refresh' })
            ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, { success: false, message: 'Token could not refresh' })

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from refreshToken controller: ', error.message) : console.log('Unknown error from refreshToken controller: ', error)
            // res.status(500).json({ success: false, message: 'Token could not refresh' })
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' })

        }
    }

    async editUser(req: Request, res: Response) {
        try {
            const { userId } = req.params
            const { data } = req.body
            console.log('user details to update: ', userId, data);

            const newUserResponse = await this.userService.updateUser(userId, data)
            // newUserResponse?.success ? res.status(200).json(newUserResponse) : res.status(400).json(newUserResponse)
            newUserResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.SUCCESS, newUserResponse) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, newUserResponse)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from editUser controller: ', error.message) : console.log('Unknown error from editUser controller: ', error)
            // res.status(500).json(error.message)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' })
        }
    }

    async editStatus(req: Request, res: Response) {
        try {
            const { id } = req.body
            // console.log('id to edit user',id);

            const newStatusResponse = await this.userService.updateUserStatus(id)
            // newStatusResponse?.success ? res.status(200).json(newStatusResponse) : res.status(400).json(newStatusResponse)
            newStatusResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.SUCCESS, newStatusResponse) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, newStatusResponse)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from editStatus controller: ', error.message) : console.log('Unknown error from editStatus controller: ', error)
            // res.status(500).json(error.message)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' })

        }
    }

    async getUser(req: Request, res: Response) {
        try {
            const { id } = req.params
            console.log('id to get user', id);

            const userResponse = await this.userService.getUser(id)
            console.log('get user response:', userResponse);

            // userResponse?.success ? res.status(200).json(userResponse) : res.status(400).json(userResponse)
            userResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.SUCCESS, userResponse) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, userResponse)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getUser controller: ', error.message) : console.log('Unknown error from getUser controller: ', error)
            // res.status(500).json(error.message)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' })
        }
    }

    async verifyEmail(req: Request, res: Response) {
        try {
            const { email } = req.body
            console.log('email to verify', req.body.email);
            const verifyEmailResponse = await this.userService.verifyUserEmail(email)
            // verifyEmailResponse?.success ? res.status(200).json(verifyEmailResponse) : res.status(400).json({ message: 'could not send otp to verify email' })
            verifyEmailResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.SUCCESS, verifyEmailResponse) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, verifyEmailResponse)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from verifyEmail controller: ', error.message) : console.log('Unknown error from verifyEmail controller: ', error)
            // res.status(500).json(error.message)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' })

        }
    }

    async verifyUser(req: Request, res: Response) {
        try {
            const { id } = req.body
            console.log('id to verify', req.body.id);
            const verifyUser = await this.userService.verifyUser(id)
            // verifyUser?.success ? res.status(200).json(verifyUser) : res.status(400).json(verifyUser)
            verifyUser?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.SUCCESS, verifyUser) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, verifyUser)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from verifyUser controller: ', error.message) : console.log('Unknown error from verifyUser controller: ', error)
            // res.status(500).json(error.message)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' })

        }
    }
}



// export default new UserController()