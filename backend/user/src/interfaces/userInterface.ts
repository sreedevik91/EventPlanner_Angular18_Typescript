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

export interface IRepository<T> {
    // getAllUsers(filter:any,sort:any,limit:number,skip:number): Promise<T[]>;
    getAllUsers(query: FilterQuery<T>, options: QueryOptions): Promise<T[] | null>;
    getUserById(userId: string): Promise<T | null>;
    createUser(userData: Partial<T>): Promise<T>;
    updateUser(userId: string, user: Partial<T>): Promise<T | null>;
    deleteUser(userId: string): Promise<DeleteResult>;
}

export interface IUserRepository {
    getAllUsers(query: FilterQuery<IUserDb>, options: QueryOptions): Promise<IUserDb[] | null>;
    getUserById(userId: string): Promise<IUserDb | null>;
    createUser(userData: Partial<IUserDb>): Promise<IUserDb>;
    updateUser(userId: string, user: Partial<IUserDb>): Promise<IUserDb | null>;
    deleteUser(userId: string): Promise<DeleteResult>;
    getUserByEmail(email: string): Promise<IUserDb | null>;
    getUserByUsername(username: string): Promise<IUserDb | null>;
    getTotalUsers(): Promise<number>
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
    SUCCESS=200,
    CREATED=201,
    BAD_REQUEST=400,
    UNAUTHORIZED=401,
    FORBIDDEN=403,
    NOT_FOUND=404,
    INTERNAL_SERVER_ERROR=500
}