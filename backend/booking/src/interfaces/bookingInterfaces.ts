import { NextFunction, Request, Response } from "express";
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
  orderDate:Date;
  tag: string; // if there is eventId in the data from frontend then tag is event booking or if serviceId there then it is service booking 
}

export interface IBookedServices {
  // serviceId: string;
  _id?: string,
  providerId?: string;
  serviceName: string;
  providerName: string;
  choiceName: string;
  choiceType: string;
  choicePrice: number;
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

export interface IServiceGrpcType {
  id: string;
  name: string;
  provider: string;
  img: string;
  events: string[];
  choices: IChoice[];
}

export interface IServiceType {
  service:string;
  providerId:string;
  name:string;
  price:number
}


export interface IChoice {
  choiceName: string;
  choiceType: string;
  choicePrice: number;
  choiceImg: string;
  id: string;
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
  providerId?:string
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

export interface IRazorpayResponse {
  razorpay_payment_id:string;
  razorpay_order_id:string;
  razorpay_signature:string;
  bookingId:string;
}

export interface ISales {
  totalAmount: number;
  totalCount: number;
  event?: string;
  service?: string;
  date: string;
}

export interface ISalesData{
  eventsData:ISales[];
  serviceData:ISales[];
  serviceSalesCount:{totalSale:number}[];
  eventSalesCount:{totalSale:number}[];
}

export interface IProviderSalesData{
  serviceData:ISales[];
  serviceSalesCount:{totalSale:number}[];
}

export interface IBookingsData{
  bookings:IBooking[];
  bookingsCount:{totalBookings:number}[];
}

export interface IRepository<T> {
  createBooking(bookingData: Partial<T>): Promise<T>
  getBookingById(bookingId: string): Promise<T | null>
  getAllBooking(query: FilterQuery<T>, options: QueryOptions): Promise<T[]>
  updateBooking(bookingId: string, data: UpdateQuery<T>): Promise<T | null>
  deleteBooking(bookingId: string): Promise<DeleteResult | null>
}

export interface IBookingRepository {
  createBooking(bookingData: Partial<IBooking>): Promise<IBooking>
  getBookingById(bookingId: string): Promise<IBooking | null>
  getAllBooking(query: FilterQuery<IBooking>, options: QueryOptions): Promise<IBooking[]>
  updateBooking(bookingId: string, data: UpdateQuery<IBooking>): Promise<IBooking | null>
  deleteBooking(bookingId: string): Promise<DeleteResult | null>
  getTotalBookings(): Promise<number>
  getBookingByUserId(id: string): Promise<IBooking[]>
  getSalesData(query: FilterQuery<IBooking>, options: QueryOptions):Promise<ISalesData[]>
  getProviderSalesData(query: FilterQuery<IBooking>, options: QueryOptions):Promise<IProviderSalesData[]>
  getBookingsAndCount(query: FilterQuery<IBooking>, options: QueryOptions): Promise<IBookingsData[]>
}

export interface IEmailService {
  sendMail(name: string, email: string, content: string, subject: string): Promise<boolean>
}

export interface IBookingService {
  totalBookings(): Promise<IResponse>
  addBooking(bookingData: Partial<IBooking>): Promise<IResponse>
  getBookings(params: IRequestParams): Promise<IResponse>
  deleteBooking(id: string): Promise<IResponse>
  deleteBookedServices(bookingId: string, serviceName: string, serviceId: string): Promise<IResponse>
  getBookingById(id: string): Promise<IResponse>
  getBookingByUserId(id: string): Promise<IResponse>
  editBooking(id: string, serviceData: Partial<IBooking>): Promise<IResponse>
  editStatus(id: string): Promise<IResponse>
  getService(name: string, providerId: string): Promise<IResponse>
  getAllEvents(): Promise<IResponse>
  getServiceByEvent(name: string): Promise<IResponse>
  confirmBooking(bookingId: string): Promise<IResponse>
  verifyPayment(razorpayResponse:IRazorpayResponse): Promise<IResponse>
  getSalesData(params: IRequestParams): Promise<IResponse>
  getProviderSales(params: IRequestParams): Promise<IResponse>
}

export interface IBookingController {
  getTotalBookings(req: Request, res: Response, next: NextFunction): Promise<void>
  createBooking(req: Request, res: Response, next: NextFunction): Promise<void>
  getAllBookings(req: Request, res: Response, next: NextFunction): Promise<void>
  deleteBooking(req: Request, res: Response, next: NextFunction): Promise<void>
  deleteBookedServices(req: Request, res: Response, next: NextFunction): Promise<void>
  getBookingById(req: Request, res: Response, next: NextFunction): Promise<void>
  getBookingByUserId(req: Request, res: Response, next: NextFunction): Promise<void>
  editBooking(req: Request, res: Response, next: NextFunction): Promise<void>
  editStatus(req: Request, res: Response, next: NextFunction): Promise<void>
  getEventService(req: Request, res: Response, next: NextFunction): Promise<void>
  getAllEvents(req: Request, res: Response, next: NextFunction): Promise<void>
  getServiceByEvent(req: Request, res: Response, next: NextFunction): Promise<void>
  confirmBooking(req: Request, res: Response, next: NextFunction): Promise<void>
  verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void>
  getSalesData(req: Request, res: Response, next: NextFunction): Promise<void>
  getProviderSales(req: Request, res: Response, next: NextFunction): Promise<void>
}

export interface IPaymentService{
  createOrder(bookingId:string,amount:number): Promise<string | null>
  verifyOrder(razorpayResponse:IRazorpayResponse):Promise<boolean>
}