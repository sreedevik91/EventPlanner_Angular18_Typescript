import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import otpGenerator from 'otp-generator'
import { IUser, IUserDb, JwtPayload, LoginData } from '../interfaces/userInterface'
import UserRepository from '../repository/userRepository'
import { ObjectId } from 'mongoose'
import { CookieOptions } from 'express'
import userRepository from '../repository/userRepository'

dotenv.config()

class UserServices {

    async getToken(payload: JwtPayload, secret: string, expiresIn: string) {
        try {
            let token = jwt.sign(payload, secret, { expiresIn: expiresIn })
            return token
        } catch (error: any) {
            console.log('Error from generate token: ', error.message);
        }

    }

    async sendMail(name: string, email: string, content: string, subject: string): Promise<boolean> {

        return new Promise((resolve, reject) => {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_APP_PASSWORD
                }
            })

            let mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: `${subject}`,
                html: `
                <div>
                <p>Dear ${name}, </p>
                <p></p>
                <p>${content}</p>
                <p></p>
                <p>Regards,</p>
                <p>Admin</p>
                <p>Dream Events</p>
                </div>
                `
            }

            transporter.sendMail(mailOptions, (error, info) => {
                // console.log(error)
                if (error) {
                    console.log(error);
                    resolve(false)
                } else {
                    resolve(true)
                }

            })

        })

    }

    async sendResetPasswordEmail(email: string) {
        try {
            const user = await UserRepository.getUserByEmail(email)

            if (user) {
                // const secret:string | undefined= process.env.JWT_ACCESS_SECRET 
                let secret = process.env.JWT_ACCESS_SECRET
                let token!: string
                if (secret) {
                    token = jwt.sign({ id: user._id, email }, secret, { expiresIn: '1d' })
                } else {
                    console.log('JWT secret is missing');
                }
                // const token = jwt.sign({ id: user._id, email },process.env.JWT_ACCESS_SECRET, { expiresIn: '5m' })
                // let link=`${process.env.EMAIL_URL}reset/${token}`
                // let content="We have received a request to reset your password for Dream Event. Kindly click the link below to continue with reset password."
                let content = `
                 <p>We have received a request to reset your password for Dream Event. Kindly click the link below to continue with reset password.</p>
                 <p><a href="${process.env.EMAIL_URL}reset/${token}"> Reset Password </a></p>
                `
                let subject = "Reset Password !"
                let response = await this.sendMail(user.name, email, content, subject)
                console.log('send email response :', response);

                if (response) {
                    return { success: true, message: 'Email sent successfully' }
                } else {
                    return { success: false, message: 'Something went wrong.Try again' }
                }

            } else {
                return { success: false, message: 'Invalid email. Enter your registered email' }
            }
        } catch (error: any) {
            console.log('Error from userService sendEmail: ', error.message);
        }

    }

    async sendOtp(name: string, email: string, id: string) {

        try {

            let otp = otpGenerator.generate(4, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
            let otpData = {
                otp,
                expiresIn: Date.now() + (60 * 1000)
            }

            const updatedUser = await UserRepository.updateUser(id, { otpData: otpData })

            let content = `
                <p>Please find below OTP for verification</p>
                <p>${otp}</p>
                `
            let subject = "Verification OTP !"

            let response = await this.sendMail(name, email, content, subject)
            console.log('send otp response: ', response);

            if (response) {
                console.log('OTP sent to email');
                return true
            }


        } catch (error: any) {
            console.log('Error from send otp: ', error.message);
        }

    }

    async resendUserOtp(id: string) {

        try {

            const user = await UserRepository.getUserById(id)
            if (user) {
                await this.sendOtp(user.name, user.email, id)
                return { success: true, message: 'Otp resent successfully' }
            } else {
                return { success: false, message: 'Something went wrong.Try again' }
            }

        } catch (error: any) {
            console.log('Error from resend user otp: ', error.message);
        }

    }

    async resetUserPassword(data: { password: string, token: string }) {

        try {
            const { password, token } = data
            let secret = process.env.JWT_ACCESS_SECRET
            let decoded: any
            if (secret) {
                decoded = jwt.verify(token, secret)
            } else {
                console.log('JWT secret is missing');
            }
            // console.log('decoded token: ', decoded);
            const user = await UserRepository.getUserById(decoded.id)
            console.log('user to reset password: ', user);

            if (user) {
                // const savePassword= await UserRepository.updateUser({_id:decoded.id},{$set:{password:password}})
                const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10))
                const savePassword = await UserRepository.updateUser(decoded.id, { password: hashedPassword })
                console.log('savePassword: ', savePassword);
                return { success: true, message: 'Password reset successfully' }
            } else {
                return { success: false, message: 'Something went wrong.Try again' }
            }

        } catch (error: any) {
            console.log('Error from reset user password: ', error.message);

        }


    }

    async register(userData: IUser) {
        try {
            if (userData.username) {
                const isUser = await UserRepository.getUserByUsername(userData.username)
                console.log('isUser: ', isUser);
                if (isUser) {
                    return { success: false, message: 'Username not available' }
                }
                const user: any = await UserRepository.createUser(userData)

                if (user) {
                    await this.sendOtp(user.name, user.email, user._id)
                }
                console.log('new user saved', user);
                return { success: true, message: 'User registered successfully', data: user }
            }


        } catch (error: any) {
            console.log('Error from userService register: ', error.message);

        }

    }

    async login(loginData: LoginData) {
        console.log('user loginData: ', loginData);

        try {
            if (loginData.googleId && loginData.email) {
                const isUser = await UserRepository.getUserByEmail(loginData.email)

                let user: IUserDb
                if (isUser) {
                    user = isUser
                    // cookieData = await this.getToken(isUser)
                } else {
                    user = await UserRepository.createUser(loginData)
                    console.log('Google user saved', user);
                    // cookieData = await this.getToken(user)
                }

                const payload: JwtPayload = {
                    id: user._id as string,
                    user: user.name,
                    role: user.role,
                    googleId: user.googleId,
                    email: user.email
                }

                let accessSecret = process.env.JWT_ACCESS_SECRET!
                let refreshSecret = process.env.JWT_REFRESH_SECRET!

                const options: CookieOptions = {
                    httpOnly: true,
                    // maxAge: 86400,
                    secure: process.env.NODE_ENV === 'production', // secure will become true when the app is running in production
                    // sameSite: 'none'
                }

                let accessToken = await this.getToken(payload, accessSecret, '1m')
                let refreshToken = await this.getToken(payload, refreshSecret, '10d')

                let cookieData = { payload, accessToken, refreshToken, options }

                return { cookieData, success: true, emailVerified: true }

            } else {
                const { username, password } = loginData

                console.log('user loginData, username, password: ', username, password);

                if (username && password) {
                    const user = await UserRepository.getUserByUsername(username)

                    console.log('user for login from db: ', user?.isVerified, user);

                    if (user) {
                        console.log('entered email verified loop ');
                        if (user.isVerified === true) {
                            if (user.password && await bcrypt.compare(password, user.password)) {
                                const payload: JwtPayload = {
                                    id: user._id as string,
                                    user: user.name,
                                    role: user.role,
                                    googleId: user.googleId,
                                    email: user.email
                                }

                                let accessSecret = process.env.JWT_ACCESS_SECRET!
                                let refreshSecret = process.env.JWT_REFRESH_SECRET!

                                const options: CookieOptions = {
                                    httpOnly: true,
                                    // maxAge: 86400,
                                    secure: process.env.NODE_ENV === 'production', // secure will become true when the app is running in production
                                    // sameSite: 'none'
                                }

                                let accessToken = await this.getToken(payload, accessSecret, '1m')
                                let refreshToken = await this.getToken(payload, refreshSecret, '10d')

                                let cookieData = { payload, accessToken, refreshToken, options }
                                console.log('sending login response from service to controller: emailVerified');

                                return { cookieData, success: true, emailVerified: true }

                            } else {
                                console.log('sending login response from service to controller: emailVerified success fail');

                                return { success: false, emailVerified: true }
                            }
                        } else {
                            console.log('sending login response from service to controller: emailNotVerified success fail');

                            return { success: false, emailVerified: false }
                        }

                    }
                } else {

                    console.log('sending login response from service to controller: user not found');

                    return { success: false, message: 'user not found' }
                }

            }
        } catch (error: any) {
            console.log('Error from userService login: ', error.message);
        }


    }

    async verifyLoginOtp(data: { id: string, otp: string }) {

        try {
            const { id, otp } = data
            const user = await UserRepository.getUserById(id)
            if (user) {
                const { otpData } = user
                if (otpData) {
                    console.log('dbTime: ', otpData.expiresIn);
                    console.log('timeNow: ', Date.now());
                    let expiry = Number(otpData.expiresIn)
                    if (Date.now() > expiry) {
                        console.log('otp expired');
                        return { success: false, message: 'Otp expired' }
                    }

                    if (otp === otpData.otp) {
                        console.log('otp matched');
                        user.isVerified = true
                        await user.save()
                        return { success: true, message: 'Otp matched' }
                    } else {
                        console.log('otp not matched');
                        return { success: false, message: 'Otp did not match' }
                    }
                }

            }
        } catch (error: any) {
            console.log('Error from verify login otp: ', error.message);
        }

    }

    async verifyUserEmail(email: string) {

        try {
            // const { email } = data
            const user = await UserRepository.getUserByEmail(email)
            if (user) {
                await this.sendOtp(user.name, user.email, user._id)
            }
            return { success: true, message: 'Otp Sent to email', data: user }
        } catch (error: any) {
            console.log('Error from verifyUserEmail: ', error.message);
        }

    }

    async getUsers(params:any) {

        try {
            const {userName,userStatus,role,pageNumber,pageSize,sortBy,sortOrder}=params
            console.log('search filter params:', userName,userStatus,role,pageNumber,pageSize,sortBy,sortOrder);
            let filterQ:any={}
            let sortQ:any={}
            let skip=0
            if(userName!==undefined){
                filterQ.name= { $regex: `.*${userName}.*`, $options: 'i' } 
                // { $regex: `.*${search}.*`, $options: 'i' } 
            }
            if(userStatus !==undefined){
                filterQ.isActive=userStatus.toLowerCase().includes('active') ? true : false
            }
            if(role!==undefined){
                filterQ.role={ $regex: `.*${role}.*`, $options: 'i' } 
            }
            if(sortOrder!==undefined && sortBy!==undefined){
                let order= sortOrder==='asc' ? 1 : -1
                if(sortBy==='name') {sortQ.name=order}
                else if(sortBy==='email') {sortQ.email=order}
                else if(sortBy==='role') {sortQ.role=order}
                else if(sortBy==='mobile') {sortQ.mobile=order}
                else if(sortBy==='isActive') {sortQ.isActive=order}              
            }else{
                sortQ.createdAt=1
            }

            console.log('sortQ: ',sortQ);
            
            skip=(Number(pageNumber)-1) * Number(pageSize)
            
            console.log('skip: ',skip);


            let data = await UserRepository.getAllUsers(filterQ,sortQ,Number(pageSize),skip)

            if (data) {
                return { success: true, data }
            } else {
                return { success: false, message: 'Could not fetch data' }
            }
        } catch (error: any) {
            console.log('Error from getUsers: ', error.message);
        }

    }

    async getNewToken(refreshToken: string) {

        // decoded token:  {
        //     id: '6738f8c218960f422dbd066c',
        //     user: 'Admin',
        //     role: 'admin',
        //     email: ' sreedevisooraj15@gmail.com',
        //     iat: 1732400320,
        //     exp: 1732401220
        //   }
        try {
            let decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!)

            const { id, user, role, googleId, email } = decoded
            const payload: JwtPayload = { id, user, role, googleId, email }
            let newToken = await this.getToken(payload, process.env.JWT_ACCESS_SECRET!, '1m')
            const options: CookieOptions = {
                httpOnly: true,
                // maxAge: 86400,
                secure: process.env.NODE_ENV === 'production', // secure will become true when the app is running in production
            }
            if (newToken) {
                return { success: true, accessToken: newToken, options, payload }
            } else {
                return { success: false, message: 'Could not refresh token' }
            }
        } catch (error: any) {
            console.log('Error from getNewToken: ', error.message);
        }

    }

    async updateUser(userId: string, data: Partial<IUser>) {
        try {
            const updatedUser = await userRepository.updateUser(userId, data)
            console.log('updatedUser: ', updatedUser);

            if (updatedUser) {
                return { success: true, data: updatedUser, message: 'User updated successfuly' }
            } else {
                return { success: false, message: 'Could not updated user' }
            }
        } catch (error: any) {
            console.log('Error from updateUser: ', error.message);
        }

    }

    async updateUserStatus(userId: string) {
        try {
            const user = await userRepository.getUserById(userId)
            if (user) {
                user.isActive = !user.isActive
                let res = await user.save()
                console.log('updatedUserStatus: ', user, res);

                if (res) {
                    return { success: true, data: res, message: 'User status updated' }
                } else {
                    return { success: false, message: 'Could not updated user status' }
                }
            }

        } catch (error: any) {
            console.log('Error from updateUserStatus: ', error.message);
        }

    }

    async getUser(id: string) {
        try {
            const user = await userRepository.getUserById(id)
            if (user) {

                return { success: true, data: user }
            } else {
                return { success: false, message: 'Could not get user details' }
            }

        } catch (error: any) {
            console.log('Error from getUser: ', error.message);
        }

    }

    async getUsersCount() {
        try {
            const user = await userRepository.getTotalUsers()
            if (user) {

                return { success: true, data: user }
            } else {
                return { success: false, message: 'Could not users count' }
            }

        } catch (error: any) {
            console.log('Error from getUsersCount: ', error.message);
        }

    }

}

export default new UserServices()