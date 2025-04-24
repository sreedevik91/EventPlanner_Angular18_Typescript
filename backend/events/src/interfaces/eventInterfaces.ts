import { NextFunction,Request,Response } from "express";
import { DeleteResult, Document, FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import grpc from '@grpc/grpc-js'

export interface IEvent extends Document {
  _id: string;
  name: string;
  img: string;
  // services:IEventServices[];
  services: string[];
  isActive: boolean;
}
export interface IEventServices {
  serviceId: string;
  ProviderId: number;
}

export interface IEventDb extends IEvent, Document {
  _id: string;
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

export interface IServiceGrpcType {
  id: string;
  name: string;
  provider: string;
  img: string;
  events: string[];
  choices: IChoiceGrpc[];
}

export interface IChoiceGrpc {
  choiceName: string;
  choiceType: string;
  choicePrice: number;
  choiceImg: string;
  id: string;
}

export interface IRequestParams {
  eventName?: string,
  isActive?: boolean,
  provider?: string,
  pageNumber?: number,
  pageSize?: number,
  sortBy?: string,
  sortOrder?: string
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


export interface IEventsData{
  events:IEvent[];
  eventsCount:{totalEvents:number}[];
}

export interface IRepository<T> {
  createEvent(service: Partial<T>): Promise<T | null>
  getEventById(eventId: string): Promise<T | null>
  getAllEvents(filter: FilterQuery<T>, options: QueryOptions): Promise<T[] | null>
  updateEvent(eventId: string, serviceData: UpdateQuery<T>): Promise<T | null>
  deleteEvent(eventId: string): Promise<DeleteResult | null>
}

export interface IEventRepository {
  getAllEvents(filter: FilterQuery<IEvent>,  options: QueryOptions): Promise<IEvent[] | null>;
  createEvent(service: Partial<IEvent>): Promise<IEvent | null>;
  getEventById(eventId: string): Promise<IEvent | null>;
  updateEvent(eventId: string, serviceData: UpdateQuery<IEvent>): Promise<IEvent | null>;
  deleteEvent(eventId: string): Promise<DeleteResult | null>;
  getTotalEvents(): Promise<number | null>;
  getEventByName(name: string):Promise<IEvent[] | null> 
  getEventsAndCount(filter: FilterQuery<IEvent>,  options: QueryOptions): Promise<IEventsData[] | null>;
}

export interface IEmailService{
  sendMail(name: string, email: string, content: string, subject: string): Promise<boolean> 
}

export interface IEventService{
  totalEvents():Promise<IResponse>
  addEvent(eventData: Partial<IEvent>):Promise<IResponse>
  getEvents(params: IRequestParams):Promise<IResponse>
  deleteEvent(eventId: string):Promise<IResponse>
  getEventById(eventId: string):Promise<IResponse>
  editEvent(eventId: string, serviceData: Partial<IEvent>):Promise<IResponse>
  editStatus(eventId: string):Promise<IResponse>
  getServiceByName(name: string):Promise<IResponse>
  getEventsByName(name: string):Promise<IResponse>
}

export interface IEventController{
  getTotalEvents(req: Request, res: Response, next:NextFunction):Promise<void>
  createEvent(req: Request, res: Response, next: NextFunction):Promise<void>
  getAllEvents(req: Request, res: Response, next:NextFunction):Promise<void>
  deleteEvent(req: Request, res: Response, next:NextFunction):Promise<void>
  getEventById(req: Request, res: Response, next:NextFunction):Promise<void>
  editEvent(req: Request, res: Response, next:NextFunction):Promise<void>
  editStatus(req: Request, res: Response, next:NextFunction):Promise<void>
  getEventServiceByName(req: Request, res: Response, next:NextFunction):Promise<void>
  getEventsByName(req: Request, res: Response, next:NextFunction):Promise<void>
}

export const SERVICE_RESPONSES = {
    commonError: 'Something went wrong.',
    totalEventsError: 'Could not get the total document',
    addEventError: 'Could not create service',
    getEventsError: 'Could not fetch data',
    deleteEventSuccess:'Event deleted successfuly',
    deleteEventError: 'Could not delete event, Something went wrong',
    getEventError: 'Could not get event, Something went wrong',
    editEventSuccess:'Event updated successfuly' ,
    editEventError:'Could not update event',
    editStatusSuccess:'Event status updated' ,
    editStatusError: 'Could not updated event status',
    getServiceError: 'Could not get event service'
}

export const CONTROLLER_RESPONSES = {
    commonError: 'Something went wrong.',
    internalServerError:'Internal Server Error'
}

export interface IGrpcEventsServiceServer {
  GetEvents: (call:grpc.ServerUnaryCall<{},IGrpcEvent>, callback:grpc.sendUnaryData<IGrpcEvent>)=>void; 
  GetEventByName: (call:grpc.ServerUnaryCall<IGrpcGetEventByNameRequest,IGrpcEventByName>, callback:grpc.sendUnaryData<IGrpcEventByName>)=>void;
  GetEventImg: (call:grpc.ServerUnaryCall<IGrpcGetEventImgRequest,IGrpcGetEventImgResponse>, callback:grpc.sendUnaryData<IGrpcGetEventImgResponse>)=>void;
  UpdateEventWithNewService: (call:grpc.ServerUnaryCall<IGrpcUpdateEventRequest,IGrpcUpdateEventResponse>, callback:grpc.sendUnaryData<IGrpcUpdateEventResponse>)=>void;
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
    EventsService: {
      service: grpc.ServiceDefinition<IGrpcEventsServiceServer>
    }
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

export interface IGrpcGetEventByNameRequest {
  name: string;
}

export interface IGrpcGetEventImgRequest {
  img: string;
}

export interface IGrpcGetEventImgResponse {
  imgPath: string;
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

export interface IGrpcEventObj {
  _id: string;
  name: string;
  services: string[];
  isActive: boolean;
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
