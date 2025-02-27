import { NextFunction,Request,Response } from "express";
import { DeleteResult, Document, FilterQuery, QueryOptions, UpdateQuery } from "mongoose";

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


// export interface IService extends Document {
//     name: string;
//     events: string[];
//     provider: string;
//     choices: IChoice[];
//     isApproved: boolean;
//     isActive: boolean;
// }
// export interface IChoice {
//     choiceName: string;
//     choiceType: string;
//     choicePrice: number;
// }


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

// export interface IGetAvailableServicesResponse {

//     id: string;
//     name: string;
//     provider: string;
//     img: string;
//     events: string[];
//     choices: Array<{
//       choiceName: string;
//       choiceType: string;
//       choicePrice: number;
//       choiceImg: string;
//     }>;

// }

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


export interface IEventsData{
  events:IEvent[];
  eventsCount:{totalEvents:number}[];
}

export interface IRepository<T> {
  createEvent(service: Partial<T>): Promise<T>
  getEventById(eventId: string): Promise<T | null>
  getAllEvents(filter: FilterQuery<T>, options: QueryOptions): Promise<T[]>
  updateEvent(eventId: string, serviceData: UpdateQuery<T>): Promise<T | null>
  deleteEvent(eventId: string): Promise<DeleteResult | null>
}

export interface IEventRepository {
  getAllEvents(filter: FilterQuery<IEvent>,  options: QueryOptions): Promise<IEvent[]>;
  createEvent(service: Partial<IEvent>): Promise<IEvent>;
  getEventById(eventId: string): Promise<IEvent | null>;
  updateEvent(eventId: string, serviceData: UpdateQuery<IEvent>): Promise<IEvent | null>;
  deleteEvent(eventId: string): Promise<DeleteResult | null>;
  getTotalEvents(): Promise<number>;
  getEventByName(name: string):Promise<IEvent[]> 
  getEventsAndCount(filter: FilterQuery<IEvent>,  options: QueryOptions): Promise<IEventsData[]>;
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
