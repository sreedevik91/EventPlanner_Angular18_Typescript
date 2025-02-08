import { NextFunction, Request, Response } from "express";
import { Date, DeleteResult, Document, FilterQuery, QueryOptions, UpdateQuery } from "mongoose";

export interface IChat extends Document {
  _id: string;
  userId: string;
  roomId:string;
  chats: IUserChat[];
}
export interface IUserChat {
  sender:string;
  receiver?:string;
  message: string;
  date: Date;
}

export interface IResponse {
  success: boolean;
  message?: string;
  data?: any;
  extra?: any
}

export enum HttpStatusCodes {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

export interface IRepository<T>{
  createChat(data:Partial<T>):Promise<T>
  getChatById(chatId:string):Promise<T | null>
  getAllChat(query:FilterQuery<T>, options:QueryOptions):Promise<T[]>
  updateChat(chatId:string,data:UpdateQuery<T>):Promise<T | null>
  deleteChat(chatId:string):Promise<DeleteResult | null>
}

export interface IChatRepository{
  createChat(data:Partial<IChat>):Promise<IChat>
  getChatById(chatId:string):Promise<IChat | null>
  getAllChat(query:FilterQuery<IChat>, options:QueryOptions):Promise<IChat[]>
  updateChat(chatId:string,data:UpdateQuery<IChat>):Promise<IChat | null>
  deleteChat(chatId:string):Promise<DeleteResult | null>
  getChatsByUserId(userId: string):Promise<IChat | null>
  getChatsByRoomId(roomId: string):Promise<IChat | null>
}

export interface IChatService{
  getChatsByUserId(userId: string):Promise<IResponse>
  saveChats(data: IChat):Promise<IResponse>
  uploadToCloudinary(img: string,name:string,type:any):Promise<IResponse>
  uploadAudioToCloudinary(audio: string,name:string):Promise<IResponse>
}

export interface IChatController{
  getChatsByUserId(req: Request, res: Response, next: NextFunction):Promise<void>
  uploadToCloudinary(req: Request, res: Response, next: NextFunction):Promise<void>
  uploadAudioToCloudinary(req: Request, res: Response, next: NextFunction):Promise<void>
}

