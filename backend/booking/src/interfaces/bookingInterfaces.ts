import { NextFunction, Request, Response  } from "express";
import { Date, DeleteResult, Document, FilterQuery, QueryOptions, UpdateQuery } from "mongoose";

export interface IBooking extends Document {
  userId: string;
  user: string;
  serviceId?: string;
  providerId?: string;
  service?: string;
  img: string;
  eventId?: string;
  event?: string;
  style?: string;
  services: IBookedServices[];
  deliveryDate: Date;
  venue: IAddress;
  totalCount: number;
  isConfirmed: boolean;
  tag: string; // if there is eventId in the data from frontend then tag is event booking or if serviceId there then it is service booking 
}

export interface IBookedServices {
  // serviceId: string;
  _id?: string,
  providerId?: string;
  serviceName: string;
  providerName: string;
  serviceChoiceName: string;
  serviceChoiceType: string;
  serviceChoiceAmount: number;
}

interface IAddress {
  building: string;
  street: string;
  city: string;
  district: string;
  state: string;
  pbNo: number;
}

export interface IEvent {
  _id: string;
  name: string;
  services: string[];
  isActive: string;
}

export interface IBookingDb extends IBooking, Document {
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

export interface IChoice {
  choiceName: string;
  choiceType: string;
  choicePrice: number;
  choiceImg: string;
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
  createBooking(bookingData:Partial<T>):Promise<T>
  getBookingById(bookingId:string):Promise<T | null>
  getAllBooking(query:FilterQuery<T>, options:QueryOptions):Promise<T[]>
  updateBooking(bookingId:string,data:UpdateQuery<T>):Promise<T | null>
  deleteBooking(bookingId:string):Promise<DeleteResult | null>
}

export interface IBookingRepository{
  createBooking(bookingData:Partial<IBooking>):Promise<IBooking>
  getBookingById(bookingId:string):Promise<IBooking | null>
  getAllBooking(query:FilterQuery<IBooking>, options:QueryOptions):Promise<IBooking[]>
  updateBooking(bookingId:string,data:UpdateQuery<IBooking>):Promise<IBooking | null>
  deleteBooking(bookingId:string):Promise<DeleteResult | null>
  getTotalBookings(): Promise<number>
  getBookingByUserId(id: string):Promise<IBooking[]>
}

export interface IEmailService{
  sendMail(name: string, email: string, content: string, subject: string): Promise<boolean> 
}

export interface IBookingService{
  totalBookings():Promise<IResponse>
  addBooking(bookingData: Partial<IBooking>):Promise<IResponse>
  getBookings(params: any):Promise<IResponse>
  deleteBooking(id: string):Promise<IResponse>
  deleteBookedServices(bookingId: string, serviceName: string, serviceId: string):Promise<IResponse> 
  getBookingById(id: string):Promise<IResponse>
  getBookingByUserId(id: string):Promise<IResponse>
  editBooking(id: string, serviceData: Partial<IBooking>):Promise<IResponse>
  editStatus(id: string):Promise<IResponse>
  getService(name: string, providerId: string):Promise<IResponse>
  getAllEvents():Promise<IResponse>
  getServiceByEvent(name: string):Promise<IResponse>
}

export interface IBookingController{
  getTotalBookings(req: Request, res: Response, next:NextFunction):Promise<void>
  createBooking(req: Request, res: Response, next: NextFunction):Promise<void>
  getAllBookings(req: Request, res: Response, next:NextFunction):Promise<void>
  deleteBooking(req: Request, res: Response, next:NextFunction):Promise<void>
  deleteBookedServices(req: Request, res: Response, next:NextFunction):Promise<void>
  getBookingById(req: Request, res: Response, next:NextFunction):Promise<void>
  getBookingByUserId(req: Request, res: Response, next:NextFunction):Promise<void>
  editBooking(req: Request, res: Response, next:NextFunction):Promise<void>
  editStatus(req: Request, res: Response, next:NextFunction):Promise<void>
  getEventService(req: Request, res: Response, next:NextFunction):Promise<void>
  getAllEvents(req: Request, res: Response, next:NextFunction):Promise<void>
  getServiceByEvent(req: Request, res: Response, next:NextFunction):Promise<void>
}