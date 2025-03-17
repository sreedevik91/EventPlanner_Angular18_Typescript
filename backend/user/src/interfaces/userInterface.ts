import { CookieOptions } from "express";
import { Document, DeleteResult, FilterQuery, QueryOptions } from "mongoose";
import { Request, Response } from 'express'
import { JwtHeader, JwtPayload } from "jsonwebtoken";

export interface IUser extends Document {
    name: string;
    email: string;
    username?: string;
    password?: string;
    mobile?: number;
    googleId?: string;
    otpData?: { otp: string; expiresIn: number }
    role: string;
    isActive: boolean;
    isEmailVerified: boolean;
    isUserVerified: boolean;
}

export interface IOtpData {
    otp: string;
    expiresIn: string;
}

export interface IUserDb extends IUser, Document {
    _id: string
}

// export type IUserDb= IUser & Document

// export interface IUserDb extends Document {
//     otpData: IOtpData;
//     _id: string;
//     name: string;
//     email: string;
//     username?: string;
//     password?: string;
//     mobile?: number;
//     googleId?:string;
//     role: string;
//     createdAt: string;
//     updatedAt: string;
//     __v: number;
//     isActive: boolean;
//     isVerified: boolean;
//   }

export interface IRequestParams {
    userName?: string,
    userStatus?:string;
    role?:string;
    isActive?: boolean,
    provider?: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: string,
    sortOrder?: string
  }

  export interface IUsersData{
    users:IUser[];
    usersCount:{totalUsers:number}[];
  }

export interface IRepository<T> {
    // getAllUsers(filter:any,sort:any,limit:number,skip:number): Promise<T[]>;
    getAllUsers(query: FilterQuery<T>, options: QueryOptions): Promise<T[] | null>;
    getUserById(userId: string): Promise<T | null>;
    createUser(userData: Partial<T>): Promise<T | null>;
    updateUser(userId: string, user: Partial<T>): Promise<T | null>;
    deleteUser(userId: string): Promise<DeleteResult | null>;
}

export interface IUserRepository {
    getAllUsers(query: FilterQuery<IUserDb>, options: QueryOptions): Promise<IUserDb[] | null>;
    getUserById(userId: string): Promise<IUserDb | null>;
    createUser(userData: Partial<IUserDb>): Promise<IUserDb | null>;
    updateUser(userId: string, user: Partial<IUserDb>): Promise<IUserDb | null>;
    deleteUser(userId: string): Promise<DeleteResult | null>;
    getUserByEmail(email: string): Promise<IUserDb | null>;
    getUserByUsername(username: string): Promise<IUserDb | null>;
    getTotalUsers(): Promise<number | null>
    getUsersAndCount(filter: FilterQuery<IUser>,  options: QueryOptions): Promise<IUsersData[] | null>;
}

export interface IJwtPayload extends JwtPayload {
    id: string;
    user: string;
    role: string;
    googleId?: string;
    email: string;
    isActive: boolean;
    isEmailVerified: boolean;
    isUserVerified: boolean;
    exp?:number;
}


export interface ICookie {
    // payload: IJwtPayload | undefined;
    // refreshToken: string | undefined;
    // accessToken: string | undefined;
    // options: CookieOptions | undefined;

    success?:boolean;
    payload: IJwtPayload;
    accessToken: string;
    refreshToken: string;
    options: CookieOptions;
}



export interface LoginData {
    name?: string;
    googleId?: string;
    email?: string;
    username?: string;
    password?: string
}

export interface IResponse {
    success: boolean;
    message?: string;
    data?: any;
    emailVerified?: boolean;
    cookieData?: ICookie;
    emailNotVerified?: boolean;
    wrongCredentials?: boolean;
    blocked?: boolean;
    noUser?: boolean;
    accessToken?:string;
    refreshToken?:string
    options?:CookieOptions,
    payload?:IJwtPayload
}

export interface IGoogleUser {
    googleId: string;
    email: string;
    name: string;
}

export interface ICookieService {
    getCookieOptions(user: IUserDb, accessToken: string, refreshToken: string): Promise<{ payload: IJwtPayload, accessToken: string, refreshToken: string, options: CookieOptions }>
}

export interface ITokenService {
    getAccessToken(payload: IUserDb): Promise<string | null>
    getRefreshToken(payload: IUserDb): Promise<string | null>
    verifyAccessToken(token: string): Promise<IJwtPayload | null>
    verifyRefreshToken(token: string): Promise<IJwtPayload | null>
}

export interface IEmailService {
    sendMail(name: string, email: string, content: string, subject: string): Promise<boolean>
}

export interface IPasswordService {
    hashPassword(password: string): Promise<string | null>
    verifyPassword(inputPassword: string, userPassword: string): Promise<boolean | null>
}

export interface IOtpService {
    sendOtp(user: IUserDb): Promise<boolean | null>
    verifyOtp(inputOtp: string, user: IUserDb): Promise<boolean | null>
}

export interface IUserService {
    sendResetPasswordEmail(email: string): Promise<IResponse>
    resendUserOtp(id: string): Promise<IResponse>
    resetUserPassword(data: { password: string, token: string }): Promise<IResponse>
    register(userData: IUserDb): Promise<IResponse>
    login(loginData: LoginData): Promise<IResponse>
    verifyLoginOtp(data: { id: string, otp: string }): Promise<IResponse>
    verifyUserEmail(email: string): Promise<IResponse>
    getUsers(params: any): Promise<IResponse>
    getNewToken(refreshToken: string): Promise<IResponse>
    updateUser(userId: string, data: Partial<IUserDb>): Promise<IResponse>
    updateUserStatus(userId: string): Promise<IResponse>
    getUser(id: string): Promise<IResponse>
    getGoogleUser(email: string): Promise<IResponse>
    getUsersCount(): Promise<IResponse>
    verifyUser(userId: string): Promise<IResponse>
    userLogout(token:string):Promise<IResponse>
}

export interface IUserController {
    registerUser(req: Request, res: Response):Promise<void>
    googleLogin(req: Request, res: Response):Promise<void>
    getGoogleUser(req: Request, res: Response):Promise<void>
    userLogin(req: Request, res: Response):Promise<void>
    sendResetEmail(req: Request, res: Response):Promise<void>
    resetPassword(req: Request, res: Response):Promise<void>
    verifyOtp(req: Request, res: Response):Promise<void>
    resendOtp(req: Request, res: Response):Promise<void>
    userLogout(req: Request, res: Response):Promise<void>
    getAllUsers(req: Request, res: Response):Promise<void>
    getUsersCount(req: Request, res: Response):Promise<void>
    refreshToken(req: Request, res: Response):Promise<void>
    editUser(req: Request, res: Response):Promise<void>
    editStatus(req: Request, res: Response):Promise<void>
    getUser(req: Request, res: Response):Promise<void>
    verifyEmail(req: Request, res: Response):Promise<void>
    verifyUser(req: Request, res: Response):Promise<void>
}


export interface IResponse {
    success: boolean;
    message?: string;
    data?: any;
    emailVerified?: boolean;
    cookieData?: ICookie;
    emailNotVerified?: boolean;
    wrongCredentials?: boolean;
    blocked?: boolean;
    noUser?: boolean;
}

export enum HttpStatusCodes{
    OK=200,
    CREATED=201,
    BAD_REQUEST=400,
    UNAUTHORIZED=401,
    FORBIDDEN=403,
    NOT_FOUND=404,
    INTERNAL_SERVER_ERROR=500
}

export const CONTROLLER_RESPONSES = {
    commonError: 'Something went wrong.',
    googleLoginError: 'No google user found',
    userNotFound: 'User not found !',
    loginSuccess:'Logged in successfully',
    emailNotVerified:'Email not verified',
    invalidCredentials:'Invalid username or password',
    accountBlocked:'Your account has been blocked. Contact admin for more details.',
    loggedOut: 'User logged out',
    refreshTokenMissing:'Refresh Token is missing',
    tokenRefresh:'Token refreshed',
    tokenRefreshError: 'Token could not refresh'
}

export const SERVICE_RESPONSES = {
    commonError: 'Something went wrong.',
    invalidEmail: 'Invalid email. Enter your registered email',
    missingToken: 'Could not get credentials',
    sendEmailError: 'Could not send email to user, something went wrong',
    sendEmailSuccess: 'Email sent successfully',
    userNotFound: 'Sorry ! User not found, Please create your account.',
    sendOtpError:'Could not send Otp.Try again',
    resendOtpSuccess: 'Otp resent successfully',
    updatePasswordError: 'Could not update password. Please try again.',
    savePasswordError: 'Could not save password',
    resetPasswordSuccess: 'Password reset successfully',
    noUsername: 'Username is required',
    usernameNotAvailable: 'Username not available',
    userRegisterError: 'Could not register user',
    userRegisterSuccess: 'User registered successfully',
    googleLoginError: 'No google user found',
    missingCredentials:'Username and password required.',
    accountBlocked: 'Your account has been blocked. Contact admin for more details.',
    emailNotVerified: 'Your email is not verified',
    invalidCredentials: 'Invalid username or password',
    otpMissmatch: 'Otp did not match',
    otpMatched:'Otp matched',
    sendOtpSuccess: 'Otp Sent to email',
    dataFetchError: 'Could not fetch data',
    refreshTokenError: 'Could not refresh token',
    updateUserSuccess:'User updated successfuly',
    updateUserError: 'Could not updated user',
    updateStatusError:'Could not updated user status',
    updateStatusSuccess:'User status updated',
    noUserData: 'Could not get user details',
    usersCountError: 'Could not get users count',
    verifyUserError:'Could not verify user',
    verifyUserSuccess: 'User verified',
}