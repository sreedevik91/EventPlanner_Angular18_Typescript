import { CookieOptions } from "express";
import { Document, DeleteResult } from "mongoose";

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

export interface IUserRepository {
    getAllUsers(filter:any,sort:any,limit:number,skip:number): Promise<IUserDb[]>;
    getUserById(id: string): Promise<IUserDb | null>;
    getUserByEmail(email: string): Promise<IUserDb | null>;
    getUserByUsername(username: string): Promise<IUserDb | null>;
    createUser(user: Partial<IUser>): Promise<IUserDb>;
    updateUser(id: string, user: Partial<IUser>): Promise<IUserDb | null>;
    deleteUser(id: string): Promise<DeleteResult>;
    getTotalUsers():Promise<number>
}

export interface JwtPayload {
    id: string;
    user: string;
    role: string;
    googleId?: string;
    email: string;
    isActive: boolean;
    isEmailVerified: boolean;
    isUserVerified: boolean;
}


export interface CookieType {
    payload: JwtPayload;
    refreshToken: string | undefined;
    accessToken: string | undefined;
    options: CookieOptions
}


export interface LoginData {
    name?: string;
    googleId?: string;
    email?: string;
    username?: string;
    password?: string
}

export interface IGoogleUser {
    googleId: string;
    email: string;
    name: string;
}

