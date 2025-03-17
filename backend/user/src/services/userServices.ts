import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import otpGenerator from 'otp-generator'
import { ICookieService, IEmailService, IOtpService, IPasswordService, ITokenService, IUser, IUserDb, IUserRepository, IJwtPayload, LoginData, IUserService, IRequestParams, SERVICE_RESPONSES } from '../interfaces/userInterface'
// import UserRepository from '../repository/userRepository'
import { CookieOptions } from 'express'
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

    // async getToken(payload: I, secret: string, expiresIn: string) {
    //     try {
    //         let token = jwt.sign(payload, secret, { expiresIn: expiresIn })
    //         return token
    //     } catch (error: unknown) {
    //         console.log('Error from generate token: ', error.message);
    //     }

    // }

    // async sendMail(name: string, email: string, content: string, subject: string): Promise<boolean> {

    //     return new Promise((resolve, reject) => {
    //         const transporter = nodemailer.createTransport({
    //             service: 'gmail',
    //             auth: {
    //                 user: process.env.EMAIL_USER,
    //                 pass: process.env.EMAIL_APP_PASSWORD
    //             }
    //         })

    //         let mailOptions = {
    //             from: process.env.EMAIL_USER,
    //             to: email,
    //             subject: `${subject}`,
    //             html: `
    //             <div>
    //             <p>Dear ${name}, </p>
    //             <p></p>
    //             <p>${content}</p>
    //             <p></p>
    //             <p>Warm Regards,</p>
    //             <p>Admin</p>
    //             <p>Dream Events</p>
    //             </div>
    //             `
    //         }

    //         transporter.sendMail(mailOptions, (error, info) => {
    //             // console.log(error)
    //             if (error) {
    //                 console.log(error);
    //                 resolve(false)
    //             } else {
    //                 resolve(true)
    //             }

    //         })

    //     })

    // }

    async sendResetPasswordEmail(email: string) {
        try {
            // const user = await UserRepository.getUserByEmail(email)
            const user = await this.UserRepository.getUserByEmail(email)

            if (!user) {
                return { success: false, message: SERVICE_RESPONSES.invalidEmail }
            }

            const token = await this.tokenService.getAccessToken(user)

            if (!token) {
                return { success: false, message: SERVICE_RESPONSES.missingToken}
            }

            let content = `
            <p>We have received a request to reset your password for Dream Event. Kindly click the link below to continue with reset password.</p>
            <p><a href="${process.env.EMAIL_URL}reset/${token}"> Reset Password </a></p>
           `
            let subject = "Reset Password !"


            const isMailSent = await this.emailService.sendMail(user.name, user.email, content, subject)

            if (!isMailSent) {
                console.log('Could not send Reset Password email');
                return { success: false, message: SERVICE_RESPONSES.sendEmailError}
            }

            return { success: true, message: SERVICE_RESPONSES.sendEmailSuccess }


            // if (user) {
            //     // const secret:string | undefined= process.env.JWT_ACCESS_SECRET 

            //     // let secret = process.env.JWT_ACCESS_SECRET
            //     // let token!: string
            //     // if (secret) {
            //     //     token = jwt.sign({ id: user._id, email }, secret, { expiresIn: '1d' })
            //     // } else {
            //     //     console.log('JWT secret is missing');
            //     // }

            //     const token = await this.tokenService.getAccessToken(user)

            //     // const token = jwt.sign({ id: user._id, email },process.env.JWT_ACCESS_SECRET, { expiresIn: '5m' })
            //     // let link=`${process.env.EMAIL_URL}reset/${token}`
            //     // let content="We have received a request to reset your password for Dream Event. Kindly click the link below to continue with reset password."

            //     let content = `
            //      <p>We have received a request to reset your password for Dream Event. Kindly click the link below to continue with reset password.</p>
            //      <p><a href="${process.env.EMAIL_URL}reset/${token}"> Reset Password </a></p>
            //     `
            //     let subject = "Reset Password !"
            //     let response = await this.emailService.sendMail(user.name, email, content, subject)
            //     console.log('send email response :', response);

            //     if (response) {
            //         return { success: true, message: 'Email sent successfully' }
            //     } else {
            //         return { success: false, message: 'Something went wrong.Try again' }
            //     }

            // } else {
            //     return { success: false, message: 'Invalid email. Enter your registered email' }
            // }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from sendResetPasswordEmail service: ', error.message) : console.log('Unknown error from sendResetPasswordEmail service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    // async sendOtp(name: string, email: string, id: string) {

    //     try {

    //         let otp = otpGenerator.generate(4, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
    //         let otpData = {
    //             otp,
    //             expiresIn: Date.now() + (60 * 1000)
    //         }

    //         const updatedUser = await this.UserRepository.updateUser(id, { otpData: otpData })

    //         let content = `
    //             <p>Please find below OTP for verification</p>
    //             <p>${otp}</p>
    //             `
    //         let subject = "Verification OTP !"

    //         let response = await this.sendMail(name, email, content, subject)
    //         console.log('send otp response: ', response);

    //         if (response) {
    //             console.log('OTP sent to email');
    //             return true
    //         }


    //     } catch (error: unknown) {
    //         console.log('Error from send otp: ', error.message);
    //     }

    // }

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

            return { success: true, message: SERVICE_RESPONSES.resendOtpSuccess}

            // if (user) {
            //     const isOtpSent=await this.otpService.sendOtp(user.name, user.email, id)
            //     return isOtpSent ? { success: true, message: 'Otp resent successfully' } : { success: false, message: 'Something went wrong.Try again' }
            // } else {
            //     return { success: false, message: "User not found" }
            // }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from resendUserOtp service: ', error.message) : console.log('Unknown error from resendUserOtp service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async resetUserPassword(data: { password: string, token: string }) {

        try {
            const { password, token } = data
            // let secret = process.env.JWT_ACCESS_SECRET
            // let decoded: any
            // if (secret) {
            //     decoded = jwt.verify(token, secret)
            // } else {
            //     console.log('JWT secret is missing');
            // }
            // console.log('decoded token: ', decoded);

            const decoded = await this.tokenService.verifyAccessToken(token)
            if (!decoded || typeof decoded === 'string') {
                return { success: false, message: SERVICE_RESPONSES.commonError}
            }
            const user = await this.UserRepository.getUserById(decoded.id)
            console.log('user to reset password: ', user);

            if (!user) {
                return { success: false, message: SERVICE_RESPONSES.userNotFound}
            }

            const hashedPassword = await this.passwordService.hashPassword(password)
            if (!hashedPassword) {
                return { success: false, message: SERVICE_RESPONSES.updatePasswordError}
            }
            const savePassword = await this.UserRepository.updateUser(decoded.id, { password: hashedPassword! })
            console.log('savePassword: ', savePassword);

            if (!savePassword) {
                return { success: false, message: SERVICE_RESPONSES.savePasswordError}
            }

            return { success: true, message: SERVICE_RESPONSES.resetPasswordSuccess}

            // if (user) {
            //     // const savePassword= await UserRepository.updateUser({_id:decoded.id},{$set:{password:password}})
            //     const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10))
            //     const savePassword = await this.UserRepository.updateUser(decoded.id, { password: hashedPassword })
            //     console.log('savePassword: ', savePassword);
            //     return { success: true, message: 'Password reset successfully' }
            // } else {
            //     return { success: false, message: 'Something went wrong.Try again' }
            // }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from resetUserPassword service: ', error.message) : console.log('Unknown error from resetUserPassword service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }


    }

    async register(userData: IUserDb) {
        try {

            if (!userData.username) {
                return { success: false, message: SERVICE_RESPONSES.noUsername}
            }

            const isUser = await this.UserRepository.getUserByUsername(userData.username)
            console.log('isUser: ', isUser);
            if (isUser) {
                return { success: false, message: SERVICE_RESPONSES.usernameNotAvailable}
            }
            const user = await this.UserRepository.createUser(userData)

            if (!user) {
                return { success: false, message: SERVICE_RESPONSES.userRegisterError}
            }

            const isOtpSent = await this.otpService.sendOtp(user)

            if (!isOtpSent) {
                return { success: false, message:SERVICE_RESPONSES.commonError }
            }

            console.log('new user saved', user);
            return { success: true, message: SERVICE_RESPONSES.userRegisterSuccess, data: user }

            // if (userData.username) {
            //     const isUser = await this.UserRepository.getUserByUsername(userData.username)
            //     console.log('isUser: ', isUser);
            //     if (isUser) {
            //         return { success: false, message: 'Username not available' }
            //     }
            //     const user = await this.UserRepository.createUser(userData)

            //     if (!user) {
            //         return { success: false, message: 'Could not register user' }
            //     }

            //     const isOtpSent = await this.otpService.sendOtp(user)

            //     if (!isOtpSent) {
            //         return { success: false, message: 'Something went wrong.Try again' }
            //     }

            //     console.log('new user saved', user);
            //     return { success: true, message: 'User registered successfully', data: user }
            // }


        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from register service: ', error.message) : console.log('Unknown error from register service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async login(loginData: LoginData) {

        console.log('user loginData: ', loginData);

        try {
            
            if (loginData.googleId && loginData.email) {
            console.log('entered google login');

                const isUser = await this.UserRepository.getUserByEmail(loginData.email)

                let user: IUserDb | null

                if (isUser) {
                    user = isUser
                    // cookieData = await this.getToken(isUser)
                } else {
                    user = await this.UserRepository.createUser(loginData)
                    console.log('Google user saved', user);
                    // cookieData = await this.getToken(user)
                }

                // const payload: IJwtPayload = {
                //     id: user._id as string,
                //     user: user.name,
                //     role: user.role,
                //     googleId: user.googleId,
                //     email: user.email,
                //     isActive: user.isActive,
                //     isEmailVerified: user.isEmailVerified,
                //     isUserVerified: user.isUserVerified
                // }

                // let accessSecret = process.env.JWT_ACCESS_SECRET!
                // let refreshSecret = process.env.JWT_REFRESH_SECRET!

                // const options: CookieOptions = {
                //     httpOnly: true,
                //     // maxAge: 86400,
                //     secure: process.env.NODE_ENV === 'production', // secure will become true when the app is running in production
                //     // sameSite: 'none'
                // }

                if (user) {
                    const accessToken = await this.tokenService.getAccessToken(user)
                    const refreshToken = await this.tokenService.getRefreshToken(user)

                    if (!accessToken && !refreshToken) {
                        console.log('No token generated');
                    }

                    let cookieData = await this.cookieService.getCookieOptions(user, accessToken!, refreshToken!)

                    return { cookieData, success: true, emailVerified: true }
                } else {
                    return { success: false, message:SERVICE_RESPONSES.googleLoginError }

                }


            } else {
            console.log('entered db login');

                const { username, password } = loginData

                console.log('user loginData, username, password: ', username, password);

                if (!username || !password) {
                    return { success: false, message: SERVICE_RESPONSES.missingCredentials}
                }

                const user = await this.UserRepository.getUserByUsername(username)
                console.log('user for login from db: ', user?.isEmailVerified, user);

                if (!user) {
                    console.log('sending login response from service to controller: user not found');
                    return { success: false, noUser: true, message: SERVICE_RESPONSES.userNotFound }
                }

                if (!user.isActive) {
                    console.log('User account is blocked');
                    return { success: false, blocked: true, message: SERVICE_RESPONSES.accountBlocked}
                }

                if (!user.isEmailVerified) {
                    console.log('sending login response from service to controller: emailNotVerified success fail');
                    return { success: false, emailNotVerified: true, message: SERVICE_RESPONSES.emailNotVerified}
                }

                if (user.password && await this.passwordService.verifyPassword(password, user.password)) {
                    const accessToken = await this.tokenService.getAccessToken(user)
                    const refreshToken = await this.tokenService.getRefreshToken(user)

                    if (!accessToken && !refreshToken) {
                        console.log('No token generated');
                    }

                    let cookieData = await this.cookieService.getCookieOptions(user, accessToken!, refreshToken!)

                    return { cookieData, success: true, emailVerified: true }

                } else {
                    console.log('sending login response from service to controller: emailVerified success fail');

                    return { success: false, wrongCredentials: true, message: SERVICE_RESPONSES.invalidCredentials}

                }

                // if (username && password) {
                //     const user = await this.UserRepository.getUserByUsername(username)

                //     console.log('user for login from db: ', user?.isEmailVerified, user);
                //     if (user === null) {
                //         console.log('sending login response from service to controller: user not found');

                //         return { success: false, noUser: true, message: 'Sorry ! User not found, Please create your account.' }
                //     } else {
                //         // if (user) {
                //         if (user.isActive) {
                //             console.log('entered email verified loop ');
                //             if (user.isEmailVerified === true) {
                //                 if (user.password && await this.passwordService.verifyPassword(password, user.password)) {
                //                     // const payload: IJwtPayload = {
                //                     //     id: user._id as string,
                //                     //     user: user.name,
                //                     //     role: user.role,
                //                     //     googleId: user.googleId,
                //                     //     email: user.email,
                //                     //     isActive: user.isActive,
                //                     //     isEmailVerified: user.isEmailVerified,
                //                     //     isUserVerified: user.isUserVerified
                //                     // }

                //                     // let accessSecret = process.env.JWT_ACCESS_SECRET!
                //                     // let refreshSecret = process.env.JWT_REFRESH_SECRET!

                //                     // const options: CookieOptions = {
                //                     //     httpOnly: true,
                //                     //     // maxAge: 86400,
                //                     //     secure: process.env.NODE_ENV === 'production', // secure will become true when the app is running in production
                //                     //     // sameSite: 'none'
                //                     // }

                //                     // let accessToken = await this.getToken(payload, accessSecret, '1m')
                //                     // let refreshToken = await this.getToken(payload, refreshSecret, '10d')

                //                     // let cookieData = { payload, accessToken, refreshToken, options }
                //                     // // console.log('sending login response from service to controller: emailVerified');

                //                     const accessToken = await this.tokenService.getAccessToken(user)
                //                     const refreshToken = await this.tokenService.getRefreshToken(user)

                //                     if (!accessToken && !refreshToken) {
                //                         console.log('No token generated');
                //                     }

                //                     let cookieData = await this.cookieService.getCookieOptions(user, accessToken!, refreshToken!)

                //                     return { cookieData, success: true, emailVerified: true }

                //                 } else {
                //                     // console.log('sending login response from service to controller: emailVerified success fail');

                //                     return { success: false, wrongCredentials: true, message: 'Invalid username or password' }
                //                 }
                //             } else {
                //                 // console.log('sending login response from service to controller: emailNotVerified success fail');

                //                 return { success: false, emailNotVerified: true, message: 'Your email is not verified' }
                //             }
                //         } else {
                //             // console.log('User account is blocked');

                //             return { success: false, blocked: true, message: 'Your account has been blocked. Contact admin for more details.' }
                //         }


                //     }
                //     // } else {

                //     //     console.log('sending login response from service to controller: user not found');

                //     //     return { success: false,emailVerified: false, message: 'user not found' }
                //     // }
                // }

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
                return { success: false, message: SERVICE_RESPONSES.userNotFound}
            }

            const isOtpMatched = await this.otpService.verifyOtp(otp, user)

            if (!isOtpMatched) {
                return { success: false, message:SERVICE_RESPONSES.otpMissmatch }
            }
            console.log('otp matched');

            const updateEmail = await this.UserRepository.updateUser(id, { isEmailVerified: true })

            if (!updateEmail) {
                return { success: false, message: SERVICE_RESPONSES.commonError }
            }

            return { success: true, message: SERVICE_RESPONSES.otpMatched}

            // if (user) {
            //     const { otpData } = user
            //     if (otpData) {
            //         console.log('dbTime: ', otpData.expiresIn);
            //         console.log('timeNow: ', Date.now());
            //         let expiry = Number(otpData.expiresIn)
            //         if (Date.now() > expiry) {
            //             console.log('otp expired');
            //             return { success: false, message: 'Otp expired' }
            //         }

            //         if (otp === otpData.otp) {
            //             console.log('otp matched');
            //             const updateEmail = await this.UserRepository.updateUser(id, { isEmailVerified: true })
            //             return updateEmail ? { success: true, message: 'Otp matched' } : { success: false, message: SERVICE_RESPONSES.commonError }
            //         } else {
            //             console.log('otp not matched');
            //             return { success: false, message: 'Otp did not match' }
            //         }
            //     }

            // }
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from verifyLoginOtp service: ', error.message) : console.log('Unknown error from verifyLoginOtp service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }

        }

    }

    async verifyUserEmail(email: string) {

        try {
            // const { email } = data
            const user = await this.UserRepository.getUserByEmail(email)

            if (!user) {
                return { success: false, message: SERVICE_RESPONSES.userNotFound}
            }

            const isOtpSent = await this.otpService.sendOtp(user)

            if (!isOtpSent) {
                return { success: false, message: SERVICE_RESPONSES.sendEmailError}
            }

            return { success: true, message:SERVICE_RESPONSES.sendOtpSuccess, data: user }

            // if (user) {
            //     await this.sendOtp(user.name, user.email, user._id)
            // }
            // return { success: true, message: 'Otp Sent to email', data: user }
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
            if (userName !== undefined) {
                filterQ.name = { $regex: `.*${userName}.*`, $options: 'i' }
                // { $regex: `.*${search}.*`, $options: 'i' } 
            }
            if (userStatus !== undefined) {
                filterQ.isActive = userStatus.toLowerCase().includes('active') ? true : false
            }
            if (role !== undefined) {
                filterQ.role = { $regex: `.*${role}.*`, $options: 'i' }
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

            // let data = await UserRepository.getAllUsers(filterQ, sortQ, Number(pageSize), skip)
            // let data = await this.UserRepository.getAllUsers(filterQ, { sort: sortQ, limit: Number(pageSize), skip })

            let usersData = await this.UserRepository.getUsersAndCount(filterQ, { sort: sortQ, limit: Number(pageSize), skip })
            console.log('all users and total count: ', usersData);


            if (usersData) {
                const data = {
                    users: usersData[0].users,
                    count: usersData[0].usersCount[0].totalUsers || 0
                }
                return { success: true, data }
            } else {
                return { success: false, message: SERVICE_RESPONSES.dataFetchError}
            }
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getUsers service: ', error.message) : console.log('Unknown error from getUsers service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async getNewToken(refreshToken: string) {

        try {
            let decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as IJwtPayload

            const { id, user, role, googleId, email, isActive, isEmailVerified, isUserVerified } = decoded
            const userData = await this.UserRepository.getUserById(id)

            if (!userData) {
                return { success: false, message:SERVICE_RESPONSES.userNotFound }
            }

            const accessToken = await this.tokenService.getAccessToken(userData)
            if (!accessToken) {
                return { success: false, message:SERVICE_RESPONSES.refreshTokenError }
            }
            const cookieOptions = await this.cookieService.getCookieOptions(userData, accessToken!, refreshToken)
            return { success: true, accessToken, refreshToken, options: cookieOptions.options, payload: cookieOptions.payload }

            // if (userData) {
            //     const payload: IJwtPayload = { id: userData._id, user: userData.name, role: userData.role, googleId: userData.googleId, email: userData.email, isActive: userData.isActive, isEmailVerified: userData.isEmailVerified, isUserVerified: userData.isUserVerified }
            //     let newToken = await this.getToken(payload, process.env.JWT_ACCESS_SECRET!, '1m')
            //     // let newToken = await this.getToken(payload, process.env.JWT_ACCESS_SECRET!, '1m')
            //     const options: CookieOptions = {
            //         httpOnly: true,
            //         // maxAge: 86400,
            //         secure: process.env.NODE_ENV === 'production', // secure will become true when the app is running in production
            //         // sameSite:'none'
            //     }
            //     if (newToken) {
            //         return { success: true, accessToken: newToken, options, payload }
            //     } else {
            //         return { success: false, message: 'Could not refresh token' }
            //     }
            // } else {
            //     return { success: false, message: 'Could not get user details while refreshing token' }
            // }

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
                return { success: true, data: updatedUser, message:SERVICE_RESPONSES.updateUserSuccess }
            } else {
                return { success: false, message:SERVICE_RESPONSES.updateUserError }
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
                return { success: false, message: SERVICE_RESPONSES.userNotFound}
            }

            let blocked: boolean = false
            const updatedUser = await this.UserRepository.updateUser(userId, { isActive: !user.isActive })
            console.log('updatedUserStatus: ', user, updatedUser);

            if (!updatedUser) {
                return { success: false, message:SERVICE_RESPONSES.updateStatusError }
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

            return { success: true, data: updatedUser, blocked, message: SERVICE_RESPONSES.updateStatusSuccess}

            // if (user) {
            //     let blocked: boolean = false
            //     user.isActive = !user.isActive
            //     let res = await user.save()
            //     console.log('updatedUserStatus: ', user, res);

            //     if (res) {
            //         if (!user.isActive) {
            //             blocked = true
            //         }

            //         let content = user.isActive ?
            //             `<p>Glad to inform that your account with Dream Events has been activated.</p>
            //             <p>May your events get more memorable with us. Happy events!</p>
            //              `
            //             :
            //             `<p>Sorry to inform that your account with Dream Events has been blocked.</p>
            //             <p>Please contact admin for furthe details.</p>
            //              `

            //         let subject = user.isActive ? "Account Verified" : "Account Blocked"

            //         await this.sendMail(user.name, user.email, content, subject)
            //         return { success: true, data: res, blocked, message: 'User status updated' }
            //     } else {
            //         return { success: false, message: 'Could not updated user status' }
            //     }
            // }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from updateUserStatus service: ', error.message) : console.log('Unknown error from updateUserStatus service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async getUser(id: string) {
        try {
            const user = await this.UserRepository.getUserById(id)

            // if (user?.isActive) {}

            if (user) {

                return { success: true, data: user }
            } else {
                return { success: false, message: SERVICE_RESPONSES.noUserData}
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
                return { success: false, message: SERVICE_RESPONSES.accountBlocked}
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
                return { success: false, message: SERVICE_RESPONSES.usersCountError}
            }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getUsersCount service: ', error.message) : console.log('Unknown error from getUsersCount service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async verifyUser(userId: string) {

        try {
            // const { email } = data
            const user = await this.UserRepository.getUserById(userId)

            if (!user) {
                return { success: false, message: SERVICE_RESPONSES.userNotFound}
            }

            const updatedUser = await this.UserRepository.updateUser(userId, { isUserVerified: true })

            if (!updatedUser) {
                return { success: false, message: SERVICE_RESPONSES.verifyUserError}
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


            // if (user) {
            //     user.isUserVerified = true
            //     await user.save()
            //     let content = `
            //     <p>Glad to inform that your account with Dream Events has been verified.</p>
            //     <p>May your events get more memorable with us. Happy events!</p>
            //    `
            //     let subject = "Account Verified"
            //     await this.sendMail(user.name, user.email, content, subject)
            //     return { success: true, message: 'user verified', data: user }
            // } else {
            //     return { success: false, message: 'could not verify user' }
            // }

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

// export default new UserServices()