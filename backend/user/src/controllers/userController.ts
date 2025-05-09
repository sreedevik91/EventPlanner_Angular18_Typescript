import { CONTROLLER_RESPONSES, HttpStatusCodes, ICookie, IResponse, IUserController, IUserService, LoginData } from "../interfaces/userInterface";
import { NextFunction, Request, Response } from 'express'
import { ResponseHandler } from "../utils/responseHandler";
import { AppError } from "../utils/appError";

export class UserController implements IUserController {

    constructor(private userService: IUserService) { }

    async registerUser(req: Request, res: Response, next: NextFunction) {
        try {
            const isUser = await this.userService.register(req.body)
            console.log('response from register user: ', isUser);

            isUser?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.CREATED, isUser) : next(new AppError(isUser))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from registerUser controller: ', error.message) : console.log('Unknown error from registerUser controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))
        }
    }

    // async googleLogin(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         console.log('google user: ', req.user);

    //         if (req.user) {
    //             const login = await this.userService.login(req.user)
    //             if (login) {
    //                 if (login.emailVerified) {
    //                     if (login.success && login.cookieData) {
    //                         const cookie: ICookie = login.cookieData

    //                         ResponseHandler.googleResponse(res, cookie)
    //                         console.log('sending login response from  controller to frontend: login success emailVerified success fail');

    //                     } else {
    //                         console.log('sending login response from  controller to frontend: login fail emailVerified success fail');
    //                         next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

    //                     }
    //                 } else {
    //                     console.log('sending login response from  controller to frontend: login fail emailNotVerified success fail');
    //                     next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

    //                 }

    //             }

    //         } else {
    //             console.log('No google user found');
    //             next(new AppError({ success: false, message: CONTROLLER_RESPONSES.googleLoginError }))

    //         }

    //     } catch (error: unknown) {
    //         error instanceof Error ? console.log('Error message from googleLogin controller: ', error.message) : console.log('Unknown error from googleLogin controller: ', error)
    //         next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

    //     }
    // }

    async googleLogin(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('google user: ', req.user);

            if (!req.user) {
                console.log('No google user found');
                return next(new AppError({ success: false, message: CONTROLLER_RESPONSES.googleLoginError }));
            }

            const login = await this.userService.login(req, req.user);
            if (!login) {
                console.log('sending login response from controller to frontend: login fail emailVerified success fail');
                return next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }));
            }

            if (!login.emailVerified) {
                console.log('sending login response from controller to frontend: login fail emailNotVerified success fail');
                return next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }));
            }

            if (login.success && login.cookieData) {
                const cookie: ICookie = login.cookieData;
                ResponseHandler.googleResponse(res, cookie);
                console.log('sending login response from controller to frontend: login success emailVerified success fail');
            } else {
                console.log('sending login response from controller to frontend: login fail emailVerified success fail');
                return next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }));
            }
        } catch (error: unknown) {
            console.log('Error message from googleLogin controller: ', error instanceof Error ? error.message : 'Unknown error');
            return next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }));
        }
    }

    async getGoogleUser(req: Request, res: Response, next: NextFunction) {
        try {
            let user: LoginData | undefined = req.user
            console.log('google user data from token: ', user);

            if (!user?.email) {
                next(new AppError({ success: false, message: CONTROLLER_RESPONSES.userNotFound }, HttpStatusCodes.NOT_FOUND))
            } else {
                let userDb = await this.userService.getGoogleUser(user?.email)

                userDb?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, userDb) : next(new AppError(userDb))

            }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getGoogleUser controller: ', error.message) : console.log('Unknown error from getGoogleUser controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }

    }


    async userLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const login = await this.userService.login(req, req.body)
            if (login) {

                if (login.success && login.cookieData) {
                    const cookie: ICookie = login.cookieData
                    const { payload, refreshToken, accessToken, options } = cookie

                    ResponseHandler.successResponse(res, HttpStatusCodes.OK, { success: true, emailVerified: true, message: CONTROLLER_RESPONSES.loginSuccess, data: payload }, cookie)
                    console.log('sending login response from  controller to frontend: login success emailVerified success fail');

                } else {
                    let status = HttpStatusCodes.BAD_REQUEST
                    let resData: IResponse = { success: false }
                    if (login.emailNotVerified) {
                        resData = { success: false, emailNotVerified: true, message: CONTROLLER_RESPONSES.emailNotVerified }
                    } else if (login.wrongCredentials) {
                        resData = { success: false, wrongCredentials: true, message: login.message ? login.message : CONTROLLER_RESPONSES.invalidCredentials }

                    } else if (login.blocked) {
                        status = HttpStatusCodes.FORBIDDEN
                        resData = { success: false, blocked: true, message: login.message ? login.message : CONTROLLER_RESPONSES.accountBlocked }

                    } else if (login.noUser) {
                        status = HttpStatusCodes.NOT_FOUND
                        resData = { success: false, message: login.message ? login.message : CONTROLLER_RESPONSES.userNotFound }

                    }

                    next(new AppError(resData, status))

                }

            }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from userLogin controller: ', error.message) : console.log('Unknown error from userLogin controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))
        }
    }

    async sendResetEmail(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.body.email);
            const resetEmailResponse = await this.userService.sendResetPasswordEmail(req.body.email)
            console.log("sendMail: ", resetEmailResponse);

            resetEmailResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, resetEmailResponse) : next(new AppError(resetEmailResponse))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from sendResetEmail controller: ', error.message) : console.log('Unknown error from sendResetEmail controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('resetPassword data from req body:', req.body);

            const resetPasswordResponse = await this.userService.resetUserPassword(req.body)

            resetPasswordResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, resetPasswordResponse) : next(new AppError(resetPasswordResponse))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from resetPassword controller: ', error.message) : console.log('Unknown error from resetPassword controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }
    }


    async verifyOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const verifyOtpResponse = await this.userService.verifyLoginOtp(req.body)

            verifyOtpResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, verifyOtpResponse) : next(new AppError(verifyOtpResponse))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from verifyOtp controller: ', error.message) : console.log('Unknown error from verifyOtp controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }
    }

    async resendOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id
            console.log("id to resend otp: ", id);

            const resendOtpResponse = await this.userService.resendUserOtp(req.params.id)

            resendOtpResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, resendOtpResponse) : next(new AppError(resendOtpResponse))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from resendOtp controller: ', error.message) : console.log('Unknown error from resendOtp controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))
        }
    }

    async userLogout(req: Request, res: Response, next: NextFunction) {
        try {

            const token = req.cookies?.accessToken
            const userLogoutResponse = await this.userService.userLogout(token)
            console.log('user logout response from controller: ', userLogoutResponse);

            // userLogoutResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, userLogoutResponse) : next(new AppError(userLogoutResponse))
            userLogoutResponse?.success ? ResponseHandler.logoutResponse(res, token, userLogoutResponse.data as number, HttpStatusCodes.OK, userLogoutResponse) : next(new AppError(userLogoutResponse))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from userLogout controller: ', error.message) : console.log('Unknown error from userLogout controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))
        }
    }

    async getAllUsers(req: Request, res: Response, next: NextFunction) {

        try {
            let users = await this.userService.getUsers(req.query)

            users?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, users) : next(new AppError(users))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getAllUsers controller: ', error.message) : console.log('Unknown error from getAllUsers controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }
    }

    async getUsersCount(req: Request, res: Response, next: NextFunction) {

        try {
            let totalUsers = await this.userService.getUsersCount()

            totalUsers?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, totalUsers) : next(new AppError(totalUsers))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getUsersCount controller: ', error.message) : console.log('Unknown error from getUsersCount controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            let refreshTokenOld = req.cookies?.refreshToken
            console.log('refreshToken: ', refreshTokenOld);
            if (!refreshTokenOld) {
                next(new AppError({ success: false, message: CONTROLLER_RESPONSES.refreshTokenMissing }))
                return
            }
            let tokenRes: IResponse = await this.userService.getNewToken(req, refreshTokenOld)
            const { accessToken, refreshToken, options, payload } = tokenRes
            if (accessToken && refreshToken && options && payload) {

                let cookieData: ICookie = { accessToken, refreshToken, options, payload }
                ResponseHandler.successResponse(res, HttpStatusCodes.OK, { success: true, message: CONTROLLER_RESPONSES.tokenRefresh, data: payload }, cookieData)
                return
            }

            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.tokenRefreshError }))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from refreshToken controller: ', error.message) : console.log('Unknown error from refreshToken controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }
    }

    async editUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params
            const { data } = req.body
            console.log('user details to update: ', userId, data);

            const newUserResponse = await this.userService.updateUser(userId, data)

            newUserResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, newUserResponse) : next(new AppError(newUserResponse))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from editUser controller: ', error.message) : console.log('Unknown error from editUser controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))
        }
    }

    async editStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.body

            const newStatusResponse = await this.userService.updateUserStatus(id)

            newStatusResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, newStatusResponse) : next(new AppError(newStatusResponse))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from editStatus controller: ', error.message) : console.log('Unknown error from editStatus controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }
    }

    async getUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            console.log('id to get user', id);

            const userResponse = await this.userService.getUser(id)
            console.log('get user response:', userResponse);

            userResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, userResponse) : next(new AppError(userResponse))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getUser controller: ', error.message) : console.log('Unknown error from getUser controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))
        }
    }

    async verifyEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body
            console.log('email to verify', req.body.email);
            const verifyEmailResponse = await this.userService.verifyUserEmail(email)

            verifyEmailResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, verifyEmailResponse) : next(new AppError(verifyEmailResponse))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from verifyEmail controller: ', error.message) : console.log('Unknown error from verifyEmail controller: ', error)
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }
    }

    async verifyUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.body
            console.log('id to verify', req.body.id);
            const verifyUser = await this.userService.verifyUser(id)

            verifyUser?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, verifyUser) : next(new AppError(verifyUser))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from verifyUser controller: ', error.message) : console.log('Unknown error from verifyUser controller: ', error)

            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))
        }
    }

    async getLoggedUser(req: Request, res: Response, next: NextFunction) {
        try {
            let token =  req.cookies?.accessToken
            
            let loggedUserResponse =await this.userService.getLoggedUser(token)
            loggedUserResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, loggedUserResponse) : next(new AppError(loggedUserResponse))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getLoggedUser controller: ', error.message) : console.log('Unknown error from getLoggedUser controller: ', error)

            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))
        }
    }
}


