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
    isVerified: boolean;
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
    getAllUsers(filter:any,sort:any,limit:number,skip:number): Promise<IUser[]>;
    getUserById(id: string): Promise<IUser | null>;
    getUserByEmail(email: string): Promise<IUser | null>;
    getUserByUsername(username: string): Promise<Document & IUser | null>;
    createUser(user: Partial<IUser>): Promise<IUser>;
    updateUser(id: string, user: Partial<IUser>): Promise<IUserDb | null>;
    deleteUser(id: string): Promise<DeleteResult>;
}

export interface JwtPayload {
    id: string;
    user: string;
    role: string;
    googleId?: string;
    email: string;
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

