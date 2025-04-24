import { DeleteResult, Document, FilterQuery, QueryOptions } from "mongoose";
import { NextFunction, Request, Response } from "express"
import grpc from '@grpc/grpc-js'

export interface IService extends Document {
  name: string;
  img: string;
  events: string[];
  provider: string;
  providerName?: string;
  choices: IChoice[];
  isApproved: boolean;
  isActive: boolean;
}

export interface IAdminService extends Document {
  name: string;
  services: string[];
}

export interface IChoice {
  choiceName: string;
  choiceType: string;
  choicePrice: number;
  choiceImg: string;
  choiceImgCategory?: string;
}

export interface IAggregateResponse {
  _id: string,
  maxPrice: number,
  minPrice: number,
  img: string[],
  events: string[],
  choicesType: string[],
  choiceImg: string[],
}

export interface IRequestParams {
  serviceName?: string,
  isApproved?: boolean,
  provider?: string,
  pageNumber?: number,
  pageSize?: number,
  sortBy?: string,
  sortOrder?: string,
  role?: string;
  providerId?: string;
}

export interface IServiceDb extends IService, Document {
  _id: string;
}

export interface IResponse<T = unknown, U = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  extra?: U;
}

export interface IEvent {
  _id: string;
  name: string;
  services: string[];
  isActive: boolean;
  img: string;
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

export interface IServicesData {
  services: IService[];
  servicesCount: { totalServices: number }[];
}

export interface IRepository<T> {
  // getAllUsers(filter:any,sort:any,limit:number,skip:number): Promise<T[]>;
  getAllServices(query: FilterQuery<T>, options: QueryOptions): Promise<T[] | null>;
  getServiceById(serviceId: string): Promise<T | null>;
  createService(serviceData: Partial<T>): Promise<T | null>;
  updateService(serviceId: string, service: Partial<T>): Promise<T | null>;
  deleteService(serviceId: string): Promise<DeleteResult | null>;
}

export interface IServiceRepository {
  getAllServices(query: FilterQuery<IService>, options: QueryOptions): Promise<IService[] | null>;
  createService(service: Partial<IService>): Promise<IService | null>;
  getServiceById(serviceId: string): Promise<IService | null>;
  updateService(serviceId: string, service: Partial<IService>): Promise<IService | null>;
  deleteService(serviceId: string): Promise<DeleteResult | null>;
  getTotalServices(): Promise<number | null>;
  getServiceByProviderOld(providerId: string): Promise<IService | null>
  getAllServiceByEventName(name: string): Promise<IService[] | null>
  getServiceByProvider(name: string, providerId: string): Promise<IService | null>
  getAllServiceByProvider(id: string): Promise<IService[] | null>
  getServiceByName(name: string): Promise<IAggregateResponse[] | null>
  getServicesAndCount(filter: FilterQuery<IService>, options: QueryOptions): Promise<IServicesData[] | null>;
}

export interface IAdminServiceRepository {
  getAllServices(query: FilterQuery<IAdminService>, options: QueryOptions): Promise<IAdminService[] | null>;
  createService(service: Partial<IAdminService>): Promise<IAdminService | null>;
  updateService(serviceId: string, service: Partial<IAdminService>): Promise<IAdminService | null>;
  deleteService(serviceId: string): Promise<DeleteResult | null>;
}

export interface IEmailService {
  sendMail(userName: string, email: string, content: string, subject: string): Promise<boolean>
}

export interface IServicesService {
  totalServices(): Promise<IResponse>
  addService(newServiceData: Partial<IService>): Promise<IResponse>
  getServices(params: IRequestParams): Promise<IResponse>
  deleteService(id: string): Promise<IResponse>
  getServiceById(id: string): Promise<IResponse>
  editService(id: string, serviceData: Partial<IService>): Promise<IResponse>
  editStatus(id: string): Promise<IResponse>
  approveService(id: string): Promise<IResponse>
  getServiceByName(name: string): Promise<IResponse>
  getAdminServices(): Promise<IResponse>
  addAdminService(adminServiceData: string[]): Promise<IResponse>
  deleteAdminService(name: string): Promise<IResponse>
  getAvailableEvents(): Promise<IResponse>
}

export interface IServiceController {
  getTotalServices(req: Request, res: Response, next: NextFunction): Promise<void>
  createService(req: Request, res: Response, next: NextFunction): Promise<void>
  getAllServices(req: Request, res: Response, next: NextFunction): Promise<void>
  deleteService(req: Request, res: Response, next: NextFunction): Promise<void>
  getServiceById(req: Request, res: Response, next: NextFunction): Promise<void>
  editService(req: Request, res: Response, next: NextFunction): Promise<void>
  approveService(req: Request, res: Response, next: NextFunction): Promise<void>
  getServiceByName(req: Request, res: Response, next: NextFunction): Promise<void>
  getAdminServices(req: Request, res: Response, next: NextFunction): Promise<void>
  addAdminService(req: Request, res: Response, next: NextFunction): Promise<void>
  deleteAdminService(req: Request, res: Response, next: NextFunction): Promise<void>
  getAvailableEvents(req: Request, res: Response, next: NextFunction): Promise<void>
}

export const SERVICE_RESPONSES = {
  commonError: 'Something went wrong.',
  totalServicesError: 'Could not get the total document',
  addServiceSuccessWithService: 'Service updated successfully',
  addServiceSuccess: 'New service added successfully',
  addServiceError: 'Could not update the service',
  getServicesError: 'Could not fetch data',
  deleteServiceSuccess: 'Service deleted successfuly',
  deleteServiceError: 'Could not delete service, Something went wrong',
  getServiceByIdError: 'Could not delete service, Something went wrong',
  editServiceSuccess: 'Service updated successfuly',
  editServiceError: 'Could not updated service',
  editStatusSuccess: 'Service status updated',
  editStatusError: 'Could not updated service status',
  editStatusErrorNoService: 'Could not find service details',
  approveServiceSuccess: 'service approved',
  approveServiceError: 'could not approve service',
  getServiceByNameError: 'Could not updated service status',
  dataFetchError: 'Could not fetch data'
}

export const CONTROLLER_RESPONSES = {
  commonError: 'Something went wrong.',
}

export interface IGrpcEventsService {
  GetEvents: (request: {}, callback: (err: grpc.ServiceError, response: IGrpcEvent) => void) => void;
  GetEventByName: (request: { name: string }, callback: (err: grpc.ServiceError, response: IGrpcEventByName) => void) => void;
  GetEventImg: (request: { img: string }, callback: (err: grpc.ServiceError, response: string) => void) => void;
  UpdateEventWithNewService: (request: IGrpcUpdateEventRequest, callback: (err: grpc.ServiceError, response: IGrpcUpdateEventResponse) => void) => void;
}

export interface IGrpcServiceDetailsServer {
  GetAvailableServices: (call: grpc.ServerUnaryCall<IGrpcGetAvailableServicesRequest, IGrpcService>, callback: grpc.sendUnaryData<IGrpcService>) => void;
  GetAvailableServicesByProvider: (call: grpc.ServerUnaryCall<IGrpcGetAvailableServicesByProviderRequest, IGrpcService>, callback: grpc.sendUnaryData<IGrpcService>) => void;
  GetAvailableServiceByProviderAndName: (call: grpc.ServerUnaryCall<IGrpcGetAvailableServiceByProviderAndNameRequest, IGrpcServiceByProvider>, callback: grpc.sendUnaryData<IGrpcServiceByProvider>) => void;
  GetServiceImg: (call: grpc.ServerUnaryCall<IGrpcGetServiceImgRequest, IGrpcGetServiceImgResponse>, callback: grpc.sendUnaryData<IGrpcGetServiceImgResponse>) => void;

}

export interface IGrpcGetAvailableServicesRequest {
  serviceName: string;
}

export interface IGrpcGetAvailableServicesByProviderRequest {
  providerId: string;
}

export interface IGrpcGetAvailableServiceByProviderAndNameRequest {
  serviceName: string;
  providerId: string;
}

export interface IGrpcGetServiceImgRequest {
  img: string;
}

export interface IGrpcGetServiceImgResponse {
  imgPath: string;
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
    ServiceDetails: {
      service: grpc.ServiceDefinition<IGrpcServiceDetailsServer>
    }
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
  events: IEvent[]
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

export interface IGrpcEventObj {
  _id: string;
  name: string;
  services: string[];
  isActive: string;
  img: string;
}

export interface IGrpcServiceObj {
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

