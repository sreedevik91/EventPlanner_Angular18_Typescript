import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import otpGenerator from 'otp-generator'
import { ICookieService, IEmailService, IOtpService, IPasswordService, ITokenService, IUser, IUserDb, IUserRepository, IJwtPayload, LoginData, IUserService, IRequestParams, SERVICE_RESPONSES, IResponse } from '../interfaces/userInterface'
// import UserRepository from '../repository/userRepository'
import { CookieOptions, Request } from 'express'
// import userRepository from '../repository/userRepository'
import { credentials } from '@grpc/grpc-js'
import { FilterQuery, QueryOptions } from 'mongoose'

dotenv.config()

export class UserServices implements IUserService {

    constructor(
        private UserRepository: IUserRepository,
        private emailService: IEmailService,
        private cookieService: ICookieService,
        private tokenService: ITokenService,
        private passwordService: IPasswordService,
        private otpService: IOtpService
    ) { }

    async sendResetPasswordEmail(email: string) {
        try {
            const user = await this.UserRepository.getUserByEmail(email)

            if (!user) {
                return { success: false, message: SERVICE_RESPONSES.invalidEmail }
            }

            const token = await this.tokenService.getAccessToken(user)

            if (!token) {
                return { success: false, message: SERVICE_RESPONSES.missingToken }
            }

            let content = `
            <p>We have received a request to reset your password for Dream Event. Kindly click the link below to continue with reset password.</p>
            <p><a href="${process.env.EMAIL_URL}reset/${token}"> Reset Password </a></p>
           `
            let subject = "Reset Password !"


            const isMailSent = await this.emailService.sendMail(user.name, user.email, content, subject)

            if (!isMailSent) {
                console.log('Could not send Reset Password email');
                return { success: false, message: SERVICE_RESPONSES.sendEmailError }
            }

            return { success: true, message: SERVICE_RESPONSES.sendEmailSuccess }


        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from sendResetPasswordEmail service: ', error.message) : console.log('Unknown error from sendResetPasswordEmail service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async resendUserOtp(id: string) {

        try {

            const user = await this.UserRepository.getUserById(id)
            if (!user) {
                return { success: false, message: SERVICE_RESPONSES.userNotFound }
            }

            const isOtpSent = await this.otpService.sendOtp(user)

            if (!isOtpSent) {
                return { success: false, message: SERVICE_RESPONSES.sendOtpError }
            }

            return { success: true, message: SERVICE_RESPONSES.resendOtpSuccess }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from resendUserOtp service: ', error.message) : console.log('Unknown error from resendUserOtp service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async resetUserPassword(data: { password: string, token: string }) {

        try {
            const { password, token } = data

            const decoded = await this.tokenService.verifyAccessToken(token)
            if (!decoded || typeof decoded === 'string') {
                return { success: false, message: SERVICE_RESPONSES.commonError }
            }
            const user = await this.UserRepository.getUserById(decoded.id)
            console.log('user to reset password: ', user);

            if (!user) {
                return { success: false, message: SERVICE_RESPONSES.userNotFound }
            }

            const hashedPassword = await this.passwordService.hashPassword(password)
            if (!hashedPassword) {
                return { success: false, message: SERVICE_RESPONSES.updatePasswordError }
            }
            const savePassword = await this.UserRepository.updateUser(decoded.id, { password: hashedPassword! })
            console.log('savePassword: ', savePassword);

            if (!savePassword) {
                return { success: false, message: SERVICE_RESPONSES.savePasswordError }
            }

            return { success: true, message: SERVICE_RESPONSES.resetPasswordSuccess }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from resetUserPassword service: ', error.message) : console.log('Unknown error from resetUserPassword service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }


    }

    async register(userData: IUserDb) {
        try {

            if (!userData.username) {
                return { success: false, message: SERVICE_RESPONSES.noUsername }
            }

            const isUserByUserName: IUserDb | null = await this.UserRepository.getUserByUsername(userData.username)
            console.log('isUserByUserName: ', isUserByUserName);

            if (isUserByUserName) {
                return { success: false, message: SERVICE_RESPONSES.usernameNotAvailable }
            }

            const isUserByEmail: IUserDb | null = await this.UserRepository.getUserByEmail(userData.email)

            if (isUserByEmail?.email === userData.email) {
                let password: string | null = ''
                if (userData.password) {
                    password = await this.passwordService.hashPassword(userData?.password)
                    if (password) userData.password = password
                }
                const userUpdate = await this.UserRepository.updateUser(isUserByEmail._id, userData)

                if (userData) {
                    // const isOtpSent = await this.otpService.sendOtp(userUpdate!)
                    // console.log('isOtpSent response from register user service: ', isOtpSent);

                    // if (!isOtpSent) {
                    //     return { success: false, message: SERVICE_RESPONSES.commonError }
                    //     console.log('otp sending failed');
                        
                    // }
                    return { success: true, message: SERVICE_RESPONSES.userRegisterSuccess, data: userUpdate }
                } else {
                    return { success: false, message: SERVICE_RESPONSES.googleUserUpdateError }
                }

            }

            const user = await this.UserRepository.createUser(userData)

            // if (!user) {
            //     return { success: false, message: SERVICE_RESPONSES.userRegisterError }
            // }

            // const isOtpSent = await this.otpService.sendOtp(user)

            // if (!isOtpSent) {
            //     return { success: false, message: SERVICE_RESPONSES.commonError }
            // }

            // console.log('new user saved', user);
            // return { success: true, message: SERVICE_RESPONSES.userRegisterSuccess, data: user }

            if (user) {
                const isOtpSent = await this.otpService.sendOtp(user)
                console.log('isOptpSent response from register user service: ', isOtpSent);

                if (!isOtpSent) {
                    return { success: false, message: SERVICE_RESPONSES.commonError }
                }
                console.log('new user saved', user);
                return { success: true, message: SERVICE_RESPONSES.userRegisterSuccess, data: user }
            } else {
                return { success: false, message: SERVICE_RESPONSES.userRegisterError }
            }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from register service: ', error.message) : console.log('Unknown error from register service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async login(req:Request,loginData: LoginData) {

        console.log('user loginData: ', loginData);

        try {

            if (loginData.googleId && loginData.email) {
                console.log('entered google login');

                const isUser = await this.UserRepository.getUserByEmail(loginData.email)

                let user: IUserDb | null

                if (isUser) {
                    user = isUser
                } else {
                    user = await this.UserRepository.createUser(loginData)
                    console.log('Google user saved', user);
                }

                if (user) {
                    const accessToken = await this.tokenService.getAccessToken(user)
                    const refreshToken = await this.tokenService.getRefreshToken(user)

                    if (!accessToken && !refreshToken) {
                        console.log('No token generated');
                    }

                    

                    let cookieData = await this.cookieService.getCookieOptions(req,user, accessToken!, refreshToken!)

                    return { cookieData, success: true, emailVerified: true }
                } else {
                    return { success: false, message: SERVICE_RESPONSES.googleLoginError }

                }


            } else {
                console.log('entered db login');

                const { username, password } = loginData

                console.log('user loginData, username, password: ', username, password);

                if (!username || !password) {
                    return { success: false, message: SERVICE_RESPONSES.missingCredentials }
                }

                const user = await this.UserRepository.getUserByUsername(username)
                console.log('user for login from db: ', user?.isEmailVerified, user);

                if (!user) {
                    console.log('sending login response from service to controller: user not found');
                    return { success: false, noUser: true, message: SERVICE_RESPONSES.userNotFound }
                }

                if (!user.isActive) {
                    console.log('User account is blocked');
                    return { success: false, blocked: true, message: SERVICE_RESPONSES.accountBlocked }
                }

                if (!user.isEmailVerified) {
                    console.log('sending login response from service to controller: emailNotVerified success fail');
                    return { success: false, emailNotVerified: true, message: SERVICE_RESPONSES.emailNotVerified }
                }

                if (user.password && await this.passwordService.verifyPassword(password, user.password)) {
                    const accessToken = await this.tokenService.getAccessToken(user)
                    const refreshToken = await this.tokenService.getRefreshToken(user)

                    if (!accessToken && !refreshToken) {
                        console.log('No token generated');
                    }

                    let cookieData = await this.cookieService.getCookieOptions(req,user, accessToken!, refreshToken!)

                    return { cookieData, success: true, emailVerified: true }

                } else {
                    console.log('sending login response from service to controller: emailVerified success fail');

                    return { success: false, wrongCredentials: true, message: SERVICE_RESPONSES.invalidCredentials }

                }

            }
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from login service: ', error.message) : console.log('Unknown error from login service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }

        }

    }

    async verifyLoginOtp(data: { id: string, otp: string }) {

        try {
            const { id, otp } = data
            const user = await this.UserRepository.getUserById(id)

            if (!user) {
                return { success: false, message: SERVICE_RESPONSES.userNotFound }
            }

            const isOtpMatched = await this.otpService.verifyOtp(otp, user)

            if (!isOtpMatched) {
                return { success: false, message: SERVICE_RESPONSES.otpMissmatch }
            }
            console.log('otp matched');

            const updateEmail = await this.UserRepository.updateUser(id, { isEmailVerified: true })

            if (!updateEmail) {
                return { success: false, message: SERVICE_RESPONSES.commonError }
            }

            return { success: true, message: SERVICE_RESPONSES.otpMatched }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from verifyLoginOtp service: ', error.message) : console.log('Unknown error from verifyLoginOtp service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }

        }

    }

    async verifyUserEmail(email: string) {

        try {
            const user = await this.UserRepository.getUserByEmail(email)

            if (!user) {
                return { success: false, message: SERVICE_RESPONSES.userNotFound }
            }

            const isOtpSent = await this.otpService.sendOtp(user)

            if (!isOtpSent) {
                return { success: false, message: SERVICE_RESPONSES.sendEmailError }
            }

            return { success: true, message: SERVICE_RESPONSES.sendOtpSuccess, data: user }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from verifyUserEmail service: ', error.message) : console.log('Unknown error from verifyUserEmail service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async getUsers(params: IRequestParams) {

        try {
            const { userName, userStatus, role, pageNumber, pageSize, sortBy, sortOrder } = params
            console.log('search filter params:', userName, userStatus, role, pageNumber, pageSize, sortBy, sortOrder);
            let filterQ: FilterQuery<IUser> = {}
            let sortQ: QueryOptions = {}
            let skip = 0
            filterQ.role = { $ne: 'admin' }
            if (userName !== undefined) {
                filterQ.name = { $regex: `.*${userName}.*`, $options: 'i' }
            }
            if (userStatus !== undefined) {
                filterQ.isActive = userStatus.toLowerCase().includes('active') ? true : false
            }
            if (role !== undefined) {
                filterQ.role = { $regex: `.*${role}.*`, $options: 'i', $ne: 'admin' }
            }
            if (sortOrder !== undefined && sortBy !== undefined) {
                let order = sortOrder === 'asc' ? 1 : -1
                if (sortBy === 'name') { sortQ.name = order }
                else if (sortBy === 'email') { sortQ.email = order }
                else if (sortBy === 'role') { sortQ.role = order }
                else if (sortBy === 'mobile') { sortQ.mobile = order }
                else if (sortBy === 'isActive') { sortQ.isActive = order }
            } else {
                sortQ.createdAt = 1
            }

            console.log('sortQ: ', sortQ);

            skip = (Number(pageNumber) - 1) * Number(pageSize)

            console.log('skip: ', skip);

            let usersData = await this.UserRepository.getUsersAndCount(filterQ, { sort: sortQ, limit: Number(pageSize), skip })
            console.log('all users and total count: ', usersData);


            if (usersData) {
                const data = {
                    users: usersData[0].users,
                    count: usersData[0].usersCount[0].totalUsers || 0
                }
                return { success: true, data }
            } else {
                return { success: false, message: SERVICE_RESPONSES.dataFetchError }
            }
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getUsers service: ', error.message) : console.log('Unknown error from getUsers service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async getNewToken(req:Request,refreshToken: string) {

        try {
            let decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as IJwtPayload

            const { id, user, role, googleId, email, isActive, isEmailVerified, isUserVerified } = decoded
            const userData = await this.UserRepository.getUserById(id)

            if (!userData) {
                return { success: false, message: SERVICE_RESPONSES.userNotFound }
            }

            const accessToken = await this.tokenService.getAccessToken(userData)
            if (!accessToken) {
                return { success: false, message: SERVICE_RESPONSES.refreshTokenError }
            }
            const cookieOptions = await this.cookieService.getCookieOptions(req,userData, accessToken!, refreshToken)
            return { success: true, accessToken, refreshToken, options: cookieOptions.options, payload: cookieOptions.payload }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getNewToken service: ', error.message) : console.log('Unknown error from getNewToken service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async updateUser(userId: string, data: Partial<IUserDb>) {
        try {
            const updatedUser = await this.UserRepository.updateUser(userId, data)
            console.log('updatedUser: ', updatedUser);

            if (updatedUser) {
                return { success: true, data: updatedUser, message: SERVICE_RESPONSES.updateUserSuccess }
            } else {
                return { success: false, message: SERVICE_RESPONSES.updateUserError }
            }
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from updateUser service: ', error.message) : console.log('Unknown error from updateUser service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async updateUserStatus(userId: string) {
        try {
            const user = await this.UserRepository.getUserById(userId)

            if (!user) {
                return { success: false, message: SERVICE_RESPONSES.userNotFound }
            }

            let blocked: boolean = false
            const updatedUser = await this.UserRepository.updateUser(userId, { isActive: !user.isActive })
            console.log('updatedUserStatus: ', user, updatedUser);

            if (!updatedUser) {
                return { success: false, message: SERVICE_RESPONSES.updateStatusError }
            }

            if (!updatedUser.isActive) {
                blocked = true
            }

            let content = updatedUser.isActive ?
                `<p>Glad to inform that your account with Dream Events has been activated.</p>
                        <p>May your events get more memorable with us. Happy events!</p>
                         `
                :
                `<p>Sorry to inform that your account with Dream Events has been blocked.</p>
                        <p>Please contact admin for furthe details.</p>
                         `

            let subject = updatedUser.isActive ? "Account Verified" : "Account Blocked"

            const isMailSent = await this.emailService.sendMail(user.name, user.email, content, subject)

            if (!isMailSent) {
                console.log('Could not send update account email');
            }

            return { success: true, data: updatedUser, blocked, message: SERVICE_RESPONSES.updateStatusSuccess }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from updateUserStatus service: ', error.message) : console.log('Unknown error from updateUserStatus service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async getUser(id: string) {
        try {
            const user = await this.UserRepository.getUserById(id)

            if (user) {

                return { success: true, data: user }
            } else {
                return { success: false, message: SERVICE_RESPONSES.noUserData }
            }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getUser service: ', error.message) : console.log('Unknown error from getUser service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async getGoogleUser(email: string) {
        try {
            const user = await this.UserRepository.getUserByEmail(email)
            if (user && user.isActive) {
                return { success: true, data: user }
            } else {
                return { success: false, message: SERVICE_RESPONSES.accountBlocked }
            }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getGoogleUser service: ', error.message) : console.log('Unknown error from getGoogleUser service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }
    async getUsersCount() {
        try {
            const user = await this.UserRepository.getTotalUsers()
            if (user) {

                return { success: true, data: user }
            } else {
                return { success: false, message: SERVICE_RESPONSES.usersCountError }
            }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getUsersCount service: ', error.message) : console.log('Unknown error from getUsersCount service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async verifyUser(userId: string) {

        try {
            const user = await this.UserRepository.getUserById(userId)

            if (!user) {
                return { success: false, message: SERVICE_RESPONSES.userNotFound }
            }

            const updatedUser = await this.UserRepository.updateUser(userId, { isUserVerified: true })

            if (!updatedUser) {
                return { success: false, message: SERVICE_RESPONSES.verifyUserError }
            }

            let content = `
            <p>Glad to inform that your account with Dream Events has been verified.</p>
            <p>May your events get more memorable with us. Happy events!</p>
           `
            let subject = "Account Verified"


            const isMailSent = await this.emailService.sendMail(user.name, user.email, content, subject)

            if (!isMailSent) {
                console.log('Could not send Account Verified email');
            }

            return { success: true, message: SERVICE_RESPONSES.verifyUserSuccess, data: user }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from verifyUser service: ', error.message) : console.log('Unknown error from verifyUser service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async userLogout(token: string) {
        try {
            const decoded = await this.tokenService.verifyAccessToken(token)
            const expirationTime = decoded?.exp
            return { success: true, data: expirationTime }
        } catch (error) {
            return { success: false, message: SERVICE_RESPONSES.commonError }

        }
    }

}
