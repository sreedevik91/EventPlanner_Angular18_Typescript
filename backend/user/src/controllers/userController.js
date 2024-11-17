const userRepository = require('../repositories/userRepository')
const userService = require('../services/userServices')


const registerUser = async (req, res) => {
    try {
        const isUser = await userService.register(req.body)
        res.json(isUser)

    } catch (error) {
        console.log('Error from Register User: ', error.message);
    }
}

const userLogin = async (req, res) => {
    try {
        const login = await userService.login(req.body)

        if (login.success) {
            const cookie = login.cookieData
            const [payload, token, options] = cookie
            res.cookie('jwtToken', token, options)
            res.json({ success: true, message: 'Logged in success', userData: payload })

        } else {
            res.json({ success: false, message: 'User not found.Invalid username or password' })
        }

    } catch (error) {
        console.log('Error from Login User: ', error.message);
    }
}

const sendResetEmail = async (req, res) => {
    try {
        console.log(req.body.email);
        const response = await userService.sendResetPasswordEmail(req.body.email)
        console.log("sendMail: ", response);
        res.json(response)
    } catch (error) {
        console.log('Error from send email to user: ', error.message);
    }
}

const resetPassword = async (req, res) => {
    try {
        // console.log(req.body);

        const response = await userService.resetUserPassword(req.body)
        // console.log('reset password response: ', response);
        res.json(response)
    } catch (error) {
        console.log('Error from reset password : ', error.message);
    }
}


const verifyOtp = async (req, res) => {
    try {
        const response = await userService.verifyLoginOtp(req.body)
        res.json(response)
    } catch (error) {
        console.log('Error from verify otp : ', error.message);
    }
}

const resendOtp = async (req, res) => {
    try {
        const id=req.params.id
        console.log("id to resend otp: ",id);
        
        const response = await userService.resendUserOtp(req.params.id)
        res.json(response)
    } catch (error) {
        console.log('Error from resend otp : ', error.message);
    }
}

const userLogout = async (req, res) => {
    res.clearCookie('jwtToken')
    res.json({ success: true, message: 'User logged out' })
}

module.exports = {
    registerUser,
    userLogin,
    userLogout,
    sendResetEmail,
    resetPassword,
    verifyOtp,
    resendOtp
}