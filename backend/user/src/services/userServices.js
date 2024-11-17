const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const nodemailer = require('nodemailer')
const userRepository = require('../repositories/userRepository')
const otpGenerator = require('otp-generator')


dotenv.config()

class UserServices {

    async getToken(user) {
        try {
            const payload = {
                id: user._id,
                user: user.name,
                role: user.role,
                googleId: user.googleId || null,
                email: user.email
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })

            const options = {
                httpOnly: true,
                maxAge: 36000,
                secure: process.env.NODE_ENV === 'production' // secure will become true when the app is running in production
            }

            return [payload, token, options]
        } catch (error) {
            console.log('Error from generate token: ', error.message);
        }

    }

    async sendMail(name, email, content) {
        try {
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
                subject: "Reset Password !",
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
                if (error) {
                    console.log(error);
                    return false
                }
                return true
                // console.log(info);
            })

        } catch (error) {
            console.log('Error from send mail: ', error.message);
        }
    }

    async sendResetPasswordEmail(email) {
        try {
            const user = await userRepository.getUser({ email })

            if (user) {

                const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, { expiresIn: '5m' })
                // let link=`${process.env.EMAIL_URL}reset/${token}`
                // let content="We have received a request to reset your password for Dream Event. Kindly click the link below to continue with reset password."
                let content = `
                 <p>We have received a request to reset your password for Dream Event. Kindly click the link below to continue with reset password.</p>
                 <p><a href="${process.env.EMAIL_URL}reset/${token}"> Reset Password </a></p>
                `
                let response = this.sendMail(user.name, email, content)
                if (response) {
                    return { success: true, message: 'Email sent successfully' }
                } else {
                    return { success: false, message: 'Something went wrong.Try again' }
                }

            } else {
                return { success: false, message: 'Invalid email. Enter your registered email' }
            }
        } catch (error) {
            console.log('Error from userService sendEmail: ', error.message);
        }

    }

    async sendOtp(name, email) {

        try {
            let otp = otpGenerator.generate(4, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
            let otpData = {
                otp,
                expiresIn: Date.now() + (60 * 1000)
            }

            const updatedUser = await userRepository.updateUser({ email: email }, { $set: { otpData: otpData } })

            let content = `
                <p>Please find below OTP for verification</p>
                <p>${otp}</p>
                `
            let response = await this.sendMail(name, email, content)
            if (response) {
                console.log('OTP sent to email');
            }


        } catch (error) {
            console.log('Error from send otp: ', error.message);
        }

    }

    async resendUserOtp(id) {

        try {

            const user = await userRepository.getUser({ _id: id })
            if (user) {
                await this.sendOtp(user.name, user.email)
                return { success: true, message: 'Otp resent successfully' }
            } else {
                return { success: false, message: 'Something went wrong.Try again' }
            }

        } catch (error) {
            console.log('Error from resend user otp: ', error.message);
        }

    }

    async resetUserPassword(data) {

        try {
            const { password, token } = data
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            // console.log('decoded token: ', decoded);
            const user = await userRepository.getUser({ _id: decoded.id })
            // console.log('user to reset password: ', user);

            if (user) {
                // const savePassword= await userRepository.updateUser({_id:decoded.id},{$set:{password:password}})
                const savePassword = await userRepository.updatePassword(decoded.id, password)
                console.log('savePassword: ', savePassword);
                return { success: true, message: 'Password reset successfully' }
            } else {
                return { success: false, message: 'Something went wrong.Try again' }
            }

        } catch (error) {
            console.log('Error from reset user password: ', error.message);

        }


    }

    async register(userData) {
        try {
            const isUser = await userRepository.getUser({ username: userData.username })
            console.log(isUser);
            if (isUser) {
                return { success: false, message: 'Username not available' }
            }
            const user = await userRepository.createUser(userData)
            // console.log('user saved', user);
            return { success: true, message: 'User registered successfully' }

        } catch (error) {
            console.log('Error from userService register: ', error.message);

        }

    }

    async login(loginData) {
        try {
            if (loginData.googleId) {
                const isUser = await userRepository.getUser({ email: loginData.email })
                let cookieData = []
                if (isUser) {
                    cookieData = await this.getToken(isUser)
                } else {
                    const user = await userRepository.createUser(req.body)
                    console.log('Google user saved', user);
                    cookieData = await this.getToken(user)
                }

                return { cookieData, success: true }

            } else {
                const { username, password, role } = loginData

                const user = await userRepository.getUser({ username })

                if (user != null && await bcrypt.compare(password, user.password)) {

                    const cookieData = await this.getToken(user)
                    this.sendOtp(user.name, user.email)
                    // console.log('cookieData: ', cookieData);
                    return { cookieData, success: true }

                } else {
                    return { success: false }
                }
            }
        } catch (error) {
            console.log('Error from userService login: ', error.message);
        }


    }

    async verifyLoginOtp(data) {

        try {
            const { id, otp } = data
            const user = await userRepository.getUser({ _id: id })
            if (user) {
                const { otpData } = user
                console.log('dbTime: ', otpData.expiresIn);
                console.log('timeNow: ', Date.now());

                if (Date.now() > otpData.expiresIn) {
                    console.log('otp expired');
                    return { success: false, message: 'Otp expired' }
                }

                if (otp === otpData.otp) {
                    console.log('otp matched');
                    return { success: true, message: 'Otp matched' }
                } else {
                    console.log('otp not matched');
                    return { success: false, message: 'Otp did not match' }
                }
            }
        } catch (error) {
            console.log('Error from verify login otp: ', error.message);
        }

    }


}

module.exports = new UserServices()