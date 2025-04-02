import { NextFunction, Request, Response } from "express";
import { Date, DeleteResult, Document, FilterQuery, ObjectId, QueryOptions, UpdateQuery } from "mongoose";

export interface IWallet extends Document {
  userId: string;
  // userId: ObjectId;
  amount: number;
  transactions:IWalletTransactions[]
}

export interface IWalletTransactions {
  type: String,
  amount: number,
  date: Date
}

export interface IServiceGrpcType {
  id: string;
  name: string;
  provider: string;
  img: string;
  events: string[];
}


export interface IRequestParams {
  userName?: string,
  isApproved?: boolean,
  provider?: string,
  pageNumber?: string,
  pageSize?: string,
  sortBy?: string,
  sortOrder?: string,
  pageNumberService?:string,
  pageNumberEvent?:string,
  sortByService?: string;
  sortOrderService?: string;
  sortByEvent?: string;
  sortOrderEvent?: string;
  startDate?: string;
  endDate?:string;
  filterBy?:string;
  providerId?:string,
  isConfirmed?:string
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

export interface IRepository<T> {
  createWallet(WalletData: Partial<T>): Promise<T | null>
  getWalletById(walletId: string): Promise<T | null>
  updateWallet(walletId: string, data: UpdateQuery<T>): Promise<T | null>
  deleteWallet(walletId: string): Promise<DeleteResult | null>
}

export interface IWalletRepository {
  createWallet(WalletData: Partial<IWallet>): Promise<IWallet | null>
  getWalletById(walletId: string): Promise<IWallet | null>
  updateWallet(walletId: string, data: UpdateQuery<IWallet>): Promise<IWallet | null>
  deleteWallet(walletId: string): Promise<DeleteResult | null>
  getWalletByUserId(userId: string): Promise<IWallet | null>
  updateWalletByUserId(userId: string, data: UpdateQuery<IWallet>): Promise<IWallet | null>
}

export interface IEmailService {
  sendMail(name: string, email: string, content: string, subject: string): Promise<boolean>
}

export interface IWalletService {
  getWalletById(id: string): Promise<IResponse>
  deleteWalletById(id: string): Promise<IResponse>
  updateWalletById(id: string,WalletData: Partial<IWallet>): Promise<IResponse>
  createWallet(WalletData: Partial<IWallet>): Promise<IResponse>
  getWalletByUserId(userId: string): Promise<IResponse>
}

export interface IWalletController {
  getWalletById(req: Request, res: Response, next: NextFunction): Promise<void>
  updateWalletById(req: Request, res: Response, next: NextFunction): Promise<void>
  deleteWalletById(req: Request, res: Response, next: NextFunction): Promise<void>
  createWallet(req: Request, res: Response, next: NextFunction): Promise<void>
  getWalletByUserId(req: Request, res: Response, next: NextFunction): Promise<void>
}

export const CONTROLLER_RESPONSES = {
  commonError: 'Something went wrong.',
  internalServerError:'Internal server error'
}

export const SERVICE_RESPONSES = {
  commonError: 'Something went wrong.',
  addWalletSuccess:'Wallet added successfully',
  addWalletError: 'Could not create wallet',
  fetchDataError: 'Fetching data failed. Try again.',
  deleteWalletSuccess:'Wallet data deleted successfuly' ,
  deleteWalletError: 'Could not delete wallet data, Something went wrong',
  updateWalletSuccess: 'Wallet updated successfuly',
  updateWalletError: 'Could not updated wallet'
}