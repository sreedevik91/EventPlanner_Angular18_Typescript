"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userInterface_1 = require("../interfaces/userInterface");
const responseHandler_1 = require("../utils/responseHandler");
// import UserService from "../services/userServices";
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isUser = yield this.userService.register(req.body);
                console.log('response from register user: ', isUser);
                // isUser?.success ? res.status(201).json(isUser) : res.status(400).json(isUser)
                (isUser === null || isUser === void 0 ? void 0 : isUser.success) ? responseHandler_1.ResponseHandler.successResponse(res, userInterface_1.HttpStatusCodes.CREATED, isUser) : responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.BAD_REQUEST, isUser);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from registerUser controller: ', error.message) : console.log('Unknown error from registerUser controller: ', error);
                // res.status(500).json(error.message)
                responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' });
            }
        });
    }
    googleLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log('google user: ', req.user);
                if (req.user) {
                    const login = yield this.userService.login(req.user);
                    if (login) {
                        if (login.emailVerified) {
                            if (login.success && login.cookieData) {
                                const cookie = login.cookieData;
                                // console.log('login cookie data: ',cookie);
                                // const { payload, refreshToken, accessToken, options } = cookie
                                // res.cookie('refreshToken', refreshToken, options) 
                                // res.cookie('accessToken', accessToken, options)
                                // res.redirect('/googleLogin/callback')
                                responseHandler_1.ResponseHandler.googleResponse(res, cookie);
                                console.log('sending login response from  controller to frontend: login success emailVerified success fail');
                            }
                            else {
                                console.log('sending login response from  controller to frontend: login fail emailVerified success fail');
                                responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' });
                            }
                        }
                        else {
                            console.log('sending login response from  controller to frontend: login fail emailNotVerified success fail');
                            responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' });
                        }
                    }
                }
                else {
                    console.log('No google user found');
                    responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'No google user found' });
                }
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from googleLogin controller: ', error.message) : console.log('Unknown error from googleLogin controller: ', error);
                responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' });
            }
        });
    }
    getGoogleUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = req.user;
                console.log('google user data from token: ', user);
                if (!(user === null || user === void 0 ? void 0 : user.email)) {
                    responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.NOT_FOUND, { success: false, message: 'User not found !' });
                }
                else {
                    let userDb = yield this.userService.getGoogleUser(user === null || user === void 0 ? void 0 : user.email);
                    // res.status(200).json({ success: true, data: user })
                    // userDb?.success ? res.status(200).json(userDb) : res.status(400).json(userDb)
                    (userDb === null || userDb === void 0 ? void 0 : userDb.success) ? responseHandler_1.ResponseHandler.successResponse(res, userInterface_1.HttpStatusCodes.SUCCESS, userDb) : responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.BAD_REQUEST, userDb);
                }
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from getGoogleUser controller: ', error.message) : console.log('Unknown error from getGoogleUser controller: ', error);
                // res.status(500).json({ success: true, message: error.message })
                responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' });
            }
        });
    }
    userLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const login = yield this.userService.login(req.body);
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
                        const cookie = login.cookieData;
                        // console.log('login cookie data: ',cookie);
                        const { payload, refreshToken, accessToken, options } = cookie;
                        // res.cookie('refreshToken', refreshToken, options)
                        // res.cookie('accessToken', accessToken, options)
                        // res.status(200).json({ success: true, emailVerified: true, message: 'Logged in success', data: payload })
                        responseHandler_1.ResponseHandler.successResponse(res, userInterface_1.HttpStatusCodes.SUCCESS, { success: true, emailVerified: true, message: 'Logged in success', data: payload }, cookie);
                        console.log('sending login response from  controller to frontend: login success emailVerified success fail');
                    }
                    else {
                        let status = userInterface_1.HttpStatusCodes.BAD_REQUEST;
                        let resData = { success: false };
                        if (login.emailNotVerified) {
                            // res.status(400).json({ success: false, emailNotVerified: true, message: 'Email not verified' })
                            resData = { success: false, emailNotVerified: true, message: 'Email not verified' };
                        }
                        else if (login.wrongCredentials) {
                            // res.status(400).json({ success: false, wrongCredentials: true, message: login.message ? login.message : 'Invalid username or password' })
                            resData = { success: false, wrongCredentials: true, message: login.message ? login.message : 'Invalid username or password' };
                        }
                        else if (login.blocked) {
                            // res.status(403).json({ success: false, blocked: true, message: login.message ? login.message : 'Your account has been blocked. Contact admin for more details.' })
                            status = userInterface_1.HttpStatusCodes.FORBIDDEN;
                            resData = { success: false, blocked: true, message: login.message ? login.message : 'Your account has been blocked. Contact admin for more details.' };
                        }
                        else if (login.noUser) {
                            // res.status(400).json({ success: false, message: login.message ? login.message : 'User not found' })
                            status = userInterface_1.HttpStatusCodes.NOT_FOUND;
                            resData = { success: false, message: login.message ? login.message : 'User not found' };
                        }
                        responseHandler_1.ResponseHandler.errorResponse(res, status, resData);
                    }
                }
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from userLogin controller: ', error.message) : console.log('Unknown error from userLogin controller: ', error);
                // res.status(500).json({ success: false, message: error.message })
                responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' });
            }
        });
    }
    sendResetEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body.email);
                const resetEmailResponse = yield this.userService.sendResetPasswordEmail(req.body.email);
                console.log("sendMail: ", resetEmailResponse);
                // resetEmailResponse?.success ? res.status(200).json(resetEmailResponse) : res.status(400).json(resetEmailResponse)
                (resetEmailResponse === null || resetEmailResponse === void 0 ? void 0 : resetEmailResponse.success) ? responseHandler_1.ResponseHandler.successResponse(res, userInterface_1.HttpStatusCodes.SUCCESS, resetEmailResponse) : responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.BAD_REQUEST, resetEmailResponse);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from sendResetEmail controller: ', error.message) : console.log('Unknown error from sendResetEmail controller: ', error);
                // res.status(500).json(error.message)
                responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('resetPassword data from req body:', req.body);
                const resetPasswordResponse = yield this.userService.resetUserPassword(req.body);
                // console.log('reset password response: ', resetPasswordResponse);
                // resetPasswordResponse?.success ? res.status(200).json(resetPasswordResponse) : res.status(400).json(resetPasswordResponse)
                (resetPasswordResponse === null || resetPasswordResponse === void 0 ? void 0 : resetPasswordResponse.success) ? responseHandler_1.ResponseHandler.successResponse(res, userInterface_1.HttpStatusCodes.SUCCESS, resetPasswordResponse) : responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.BAD_REQUEST, resetPasswordResponse);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from resetPassword controller: ', error.message) : console.log('Unknown error from resetPassword controller: ', error);
                // res.status(500).json(error.message)
                responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' });
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifyOtpResponse = yield this.userService.verifyLoginOtp(req.body);
                // verifyOtpResponse?.success ? res.status(200).json(verifyOtpResponse) : res.status(400).json(verifyOtpResponse)
                (verifyOtpResponse === null || verifyOtpResponse === void 0 ? void 0 : verifyOtpResponse.success) ? responseHandler_1.ResponseHandler.successResponse(res, userInterface_1.HttpStatusCodes.SUCCESS, verifyOtpResponse) : responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.BAD_REQUEST, verifyOtpResponse);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from verifyOtp controller: ', error.message) : console.log('Unknown error from verifyOtp controller: ', error);
                // res.status(500).json(error.message)
                responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' });
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                console.log("id to resend otp: ", id);
                const resendOtpResponse = yield this.userService.resendUserOtp(req.params.id);
                // resendOtpResponse?.success ? res.status(200).json(resendOtpResponse) : res.status(400).json(resendOtpResponse)
                (resendOtpResponse === null || resendOtpResponse === void 0 ? void 0 : resendOtpResponse.success) ? responseHandler_1.ResponseHandler.successResponse(res, userInterface_1.HttpStatusCodes.SUCCESS, resendOtpResponse) : responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.BAD_REQUEST, resendOtpResponse);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from resendOtp controller: ', error.message) : console.log('Unknown error from resendOtp controller: ', error);
                // res.status(500).json(error.message)
                responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' });
            }
        });
    }
    userLogout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // res.clearCookie('accessToken')
                // res.clearCookie('refreshToken')
                // res.status(200).json({ success: true, message: 'User logged out' })
                const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
                const userLogoutResponse = yield this.userService.userLogout(token);
                console.log('user logout response from controller: ', userLogoutResponse);
                userLogoutResponse.success ? responseHandler_1.ResponseHandler.logoutResponse(res, token, userLogoutResponse.data, userInterface_1.HttpStatusCodes.SUCCESS, { success: true, message: 'User logged out' }) : responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.BAD_REQUEST, userLogoutResponse);
            }
            catch (error) {
                // res.status(500).json(error.message)
                error instanceof Error ? console.log('Error message from userLogout controller: ', error.message) : console.log('Unknown error from userLogout controller: ', error);
                responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' });
            }
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let users = yield this.userService.getUsers(req.query);
                // users?.success ? res.status(200).json(users) : res.status(400).json(users)
                (users === null || users === void 0 ? void 0 : users.success) ? responseHandler_1.ResponseHandler.successResponse(res, userInterface_1.HttpStatusCodes.SUCCESS, users) : responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.BAD_REQUEST, users);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from getAllUsers controller: ', error.message) : console.log('Unknown error from getAllUsers controller: ', error);
                // res.status(500).json(error.message)
                responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' });
            }
        });
    }
    getUsersCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let totalUsers = yield this.userService.getUsersCount();
                // totalUsers?.success ? res.status(200).json(totalUsers) : res.status(400).json(totalUsers)
                (totalUsers === null || totalUsers === void 0 ? void 0 : totalUsers.success) ? responseHandler_1.ResponseHandler.successResponse(res, userInterface_1.HttpStatusCodes.SUCCESS, totalUsers) : responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.BAD_REQUEST, totalUsers);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from getUsersCount controller: ', error.message) : console.log('Unknown error from getUsersCount controller: ', error);
                // res.status(500).json(error.message)
                responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' });
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let refreshTokenOld = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
                console.log('refreshToken: ', refreshTokenOld);
                if (!refreshTokenOld) {
                    // res.json({ success: false, message: 'Refresh Token is missing' })
                    responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.BAD_REQUEST, { success: false, message: 'Refresh Token is missing' });
                    return;
                }
                let tokenRes = yield this.userService.getNewToken(refreshTokenOld);
                const { accessToken, refreshToken, options, payload } = tokenRes;
                if (accessToken && refreshToken && options && payload) {
                    // res.cookie('accessToken', accessToken, options)
                    // res.cookie('refreshToken', refreshToken, options)
                    // res.status(200).json({ success: true, message: 'Token refreshed', data: payload })
                    let cookieData = { accessToken, refreshToken, options, payload };
                    responseHandler_1.ResponseHandler.successResponse(res, userInterface_1.HttpStatusCodes.SUCCESS, { success: true, message: 'Token refreshed', data: payload }, cookieData);
                    return;
                }
                // res.status(400).json({ success: false, message: 'Token could not refresh' })
                responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.BAD_REQUEST, { success: false, message: 'Token could not refresh' });
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from refreshToken controller: ', error.message) : console.log('Unknown error from refreshToken controller: ', error);
                // res.status(500).json({ success: false, message: 'Token could not refresh' })
                responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' });
            }
        });
    }
    editUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const { data } = req.body;
                console.log('user details to update: ', userId, data);
                const newUserResponse = yield this.userService.updateUser(userId, data);
                // newUserResponse?.success ? res.status(200).json(newUserResponse) : res.status(400).json(newUserResponse)
                (newUserResponse === null || newUserResponse === void 0 ? void 0 : newUserResponse.success) ? responseHandler_1.ResponseHandler.successResponse(res, userInterface_1.HttpStatusCodes.SUCCESS, newUserResponse) : responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.BAD_REQUEST, newUserResponse);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from editUser controller: ', error.message) : console.log('Unknown error from editUser controller: ', error);
                // res.status(500).json(error.message)
                responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' });
            }
        });
    }
    editStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                // console.log('id to edit user',id);
                const newStatusResponse = yield this.userService.updateUserStatus(id);
                // newStatusResponse?.success ? res.status(200).json(newStatusResponse) : res.status(400).json(newStatusResponse)
                (newStatusResponse === null || newStatusResponse === void 0 ? void 0 : newStatusResponse.success) ? responseHandler_1.ResponseHandler.successResponse(res, userInterface_1.HttpStatusCodes.SUCCESS, newStatusResponse) : responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.BAD_REQUEST, newStatusResponse);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from editStatus controller: ', error.message) : console.log('Unknown error from editStatus controller: ', error);
                // res.status(500).json(error.message)
                responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' });
            }
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log('id to get user', id);
                const userResponse = yield this.userService.getUser(id);
                console.log('get user response:', userResponse);
                // userResponse?.success ? res.status(200).json(userResponse) : res.status(400).json(userResponse)
                (userResponse === null || userResponse === void 0 ? void 0 : userResponse.success) ? responseHandler_1.ResponseHandler.successResponse(res, userInterface_1.HttpStatusCodes.SUCCESS, userResponse) : responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.BAD_REQUEST, userResponse);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from getUser controller: ', error.message) : console.log('Unknown error from getUser controller: ', error);
                // res.status(500).json(error.message)
                responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' });
            }
        });
    }
    verifyEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                console.log('email to verify', req.body.email);
                const verifyEmailResponse = yield this.userService.verifyUserEmail(email);
                // verifyEmailResponse?.success ? res.status(200).json(verifyEmailResponse) : res.status(400).json({ message: 'could not send otp to verify email' })
                (verifyEmailResponse === null || verifyEmailResponse === void 0 ? void 0 : verifyEmailResponse.success) ? responseHandler_1.ResponseHandler.successResponse(res, userInterface_1.HttpStatusCodes.SUCCESS, verifyEmailResponse) : responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.BAD_REQUEST, verifyEmailResponse);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from verifyEmail controller: ', error.message) : console.log('Unknown error from verifyEmail controller: ', error);
                // res.status(500).json(error.message)
                responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' });
            }
        });
    }
    verifyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                console.log('id to verify', req.body.id);
                const verifyUser = yield this.userService.verifyUser(id);
                // verifyUser?.success ? res.status(200).json(verifyUser) : res.status(400).json(verifyUser)
                (verifyUser === null || verifyUser === void 0 ? void 0 : verifyUser.success) ? responseHandler_1.ResponseHandler.successResponse(res, userInterface_1.HttpStatusCodes.SUCCESS, verifyUser) : responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.BAD_REQUEST, verifyUser);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from verifyUser controller: ', error.message) : console.log('Unknown error from verifyUser controller: ', error);
                // res.status(500).json(error.message)
                responseHandler_1.ResponseHandler.errorResponse(res, userInterface_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong !' });
            }
        });
    }
}
exports.UserController = UserController;
// export default new UserController()
