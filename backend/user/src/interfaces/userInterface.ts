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
    status: string;
}

export type IUserDb= IUser & Document

export interface IUserRepository {
    getAllUsers(): Promise<IUser[]>;
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
    token: string;
    options:CookieOptions
}


export interface LoginData {
    name?: string;
    googleId?: string;
    email?: string;
    username?: string;
    password?: string
}