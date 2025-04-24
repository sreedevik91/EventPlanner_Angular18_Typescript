import { NextFunction, Request, Response } from "express";
import { Date, DeleteResult, Document, FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import grpc from '@grpc/grpc-js'

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

export interface IResponse<T=unknown,U=unknown> {
  success: boolean;
  message?: string;
  data?: T;
  extra?: U;
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
  createChat(data:Partial<T>):Promise<T | null>
  getChatById(chatId:string):Promise<T | null>
  getAllChat(query:FilterQuery<T>, options:QueryOptions):Promise<T[] | null>
  updateChat(chatId:string,data:UpdateQuery<T>):Promise<T | null>
  deleteChat(chatId:string):Promise<DeleteResult | null>
}

export interface IChatRepository{
  createChat(data:Partial<IChat>):Promise<IChat | null>
  getChatById(chatId:string):Promise<IChat | null>
  getAllChat(query:FilterQuery<IChat>, options:QueryOptions):Promise<IChat[] | null>
  updateChat(chatId:string,data:UpdateQuery<IChat>):Promise<IChat | null>
  deleteChat(chatId:string):Promise<DeleteResult | null>
  getChatsByUserId(userId: string):Promise<IChat | null>
  getChatsByRoomId(roomId: string):Promise<IChat | null>
}

export interface IChatService{
  getChatsByUserId(userId: string):Promise<IResponse>
  saveChats(data: IChat):Promise<IResponse>
  uploadToCloudinary(img: string,name:string,type: "image" | "video" | "raw" | "auto" | undefined):Promise<IResponse>
  uploadAudioToCloudinary(audio: string,name:string):Promise<IResponse>
}

export interface IChatController{
  getChatsByUserId(req: Request, res: Response, next: NextFunction):Promise<void>
  uploadToCloudinary(req: Request, res: Response, next: NextFunction):Promise<void>
  uploadAudioToCloudinary(req: Request, res: Response, next: NextFunction):Promise<void>
}

export const CONTROLLER_RESPONSES = {
  commonError: 'Something went wrong.'
}

export const SERVICE_RESPONSES = {
  commonError: 'Something went wrong.',
  getChatError:'Could not get booking, Something went wrong',
  saveChatError: 'Could not save chat, Something went wrong'
}

export interface IGrpcEventsService {
  GetEvents: (request: {}, callback: (err: grpc.ServiceError, response: IGrpcEvent) => void) => void;
  GetEventByName: (request: { name: string }, callback: (err: grpc.ServiceError, response: IGrpcEventByName) => void) => void;
  GetEventImg: (request: { img: string }, callback: (err: grpc.ServiceError, response: string) => void) => void;
  UpdateEventWithNewService: (request: IGrpcUpdateEventRequest, callback: (err: grpc.ServiceError, response: IGrpcUpdateEventResponse) => void) => void;
}

export interface IGrpcServiceDetails {
  GetAvailableServices: (request: { serviceName: string }, callback: (err: grpc.ServiceError, response: IGrpcService) => void) => void;
  GetAvailableServicesByProvider: (request: { providerId: string }, callback: (err: grpc.ServiceError, response: IGrpcService) => void) => void;
  GetAvailableServiceByProviderAndName: (request: { serviceName: string, providerId: string }, callback: (err: grpc.ServiceError, response: IGrpcServiceByProvider) => void) => void;
  GetServiceImg: (request: { img: string }, callback: (err: grpc.ServiceError, response: string) => void) => void;
}

export interface IGrpcUserService {
  GetUser: (request: { id: string }, callback: (err: grpc.ServiceError, response: IGrpcUserObj) => void) => void;
}

export interface IGrpcWalletService {
  GetWallet: (request: { userId: string }, callback: (err: grpc.ServiceError, response: IGrpcWalletObj) => void) => void;
  UpdateWallet: (request: IGrpcWalletUpdateRequest, callback: (err: grpc.ServiceError, response: IGrpcWalletObj) => void) => void;
}

export interface EventsPackage {
  events: {
    EventsService: new (address: string, credentials: grpc.ChannelCredentials) => IGrpcEventsService;
  };
}

export interface UserPackage {
  user: {
    UserService: new (address: string, credentials: grpc.ChannelCredentials) => IGrpcUserService;
  };
}

export interface ServicePackage {
  service: {
    ServiceDetails: new (address: string, credentials: grpc.ChannelCredentials) => IGrpcServiceDetails;
  };
}

export interface WalletPackage {
  wallet: {
    WalletProto: new (address: string, credentials: grpc.ChannelCredentials) => IGrpcWalletService;
  };
}

export interface IGrpcUpdateEventRequest {
  serviceName: string;
  events: string[];
}

export interface IGrpcUpdateEventResponse {
  message: string;
  success: boolean;
}

export interface IGrpcEvent {
  events: IGrpcEventObj[]
}

export interface IGrpcEventByName {
  event: IGrpcEventObj[]
}

export interface IGrpcService {
  serviceData: IGrpcServiceObj[]
}

export interface IGrpcServiceByProvider {
  serviceDetails: IGrpcServiceObj
}

interface IGrpcEventObj {
  _id: string;
  name: string;
  services: string[];
  isActive: string;
  img: string;
}

interface IGrpcServiceObj {
  id: string;
  name: string;
  provider: string;
  events: string[];
  choices: IChoice[];
  img: string;
}

export interface IGrpcUserObj {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

interface IGrpcWalletUpdateRequest {
  userId: string;
  type: string;
  amount: number;
}

interface IGrpcWalletObj {
  id: string;
  userId: string;
  amount: number;
  transactions: IWalletTransactions[];
}

interface IWalletTransactions {
  type: string;
  amount: number;
  date: string;
}

interface IChoice {
  choiceName: string;
  choiceType: string;
  choicePrice: number;
  choiceImg: string;
  id: string;
}

export interface IGetAvailableServicesResponse {
  serviceList: Array<{
    id: string;
    name: string;
    provider: string;
    img: string;
    events: string[];
    choices: Array<{
      choiceName: string;
      choiceType: string;
      choicePrice: number;
      choiceImg: string;
    }>;
  }>;
}
