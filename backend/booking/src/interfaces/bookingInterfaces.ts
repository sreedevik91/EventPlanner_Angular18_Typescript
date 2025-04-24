import { NextFunction, Request, Response } from "express";
import { Date, DeleteResult, Document, FilterQuery, ObjectId, QueryOptions, UpdateQuery } from "mongoose";
import * as grpc from '@grpc/grpc-js';

export interface IBooking extends Document {
  userId: string;
  // userId: ObjectId;
  user: string;
  serviceId?: string;
  providerId?: string;
  service?: string;
  img: string;
  eventId?: string;
  event?: string;
  style?: string;
  paymentType: string;
  services: IBookedServices[];
  deliveryDate: Date;
  venue: IAddress;
  totalCount: number;
  isConfirmed: boolean;
  isApproved: boolean;
  orderDate: Date;
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

export interface IEvent {
  _id: string;
  name: string;
  services: string[];
  isActive: string;
  img?: string;
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
  service: string;
  providerId: string;
  name: string;
  price: number
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
  pageNumberService?: string,
  pageNumberEvent?: string,
  sortByService?: string;
  sortOrderService?: string;
  sortByEvent?: string;
  sortOrderEvent?: string;
  startDate?: string;
  endDate?: string;
  filterBy?: string;
  providerId?: string,
  isConfirmed?: string
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

export interface IResponse<T = unknown, U = unknown> {
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

export interface IRazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  bookingId: string;
}

export interface ISales {
  totalAmount: number;
  totalCount: number;
  event?: string;
  service?: string;
  date: string;
}

export interface ISalesDataOut {
  eventSales: ISales[];
  eventSalesCount: number;
  servicesSales: ISales[];
  serviceSalesCount: number;
}

export interface ISalesData {
  eventsData: ISales[];
  serviceData: ISales[];
  serviceSalesNumber: { totalSale: number }[];
  eventSalesCount: { totalSale: number }[];
}

export interface IProviderSalesData {
  serviceData: ISales[];
  serviceSalesNumber: { totalSale: number }[];
}

export interface IBookingsData {
  bookings: IBooking[];
  bookingsCount: { totalBookings: number }[];
}

export interface IBookingsDataOut {
  bookings: IBooking[];
  count: number;
}

export interface IAdminBookingData {
  bookingData: { type: string, customer: string, date: Date, isConfirmed: boolean }[];
  totalRevenue: { totalAmount: number }[];
  oldBookings: { count: number }[];
  upcomingBookings: { count: number }[];
  totalBooking: { count: number }[]
}

export interface IChartsDataAdmin {
  servicesChartData: { _id: { service: string, date: number }, amount: number }[],
  eventsChartData: { _id: { event: string, date: number }, amount: number }[],
  // providerChartData:{_id:{provider:string,date:number},amount:number}[]
}
export interface IChartsDataProvider {
  providerChartData: { _id: { provider: string, date: number, service: string }, amount: number }[]
}

export interface IChartDataResponseAdmin {
  servicesChartData: {
    label: string[];
    amount: number[];
  };
  eventsChartData: {
    label: string[];
    amount: number[];
  };

}

export interface IChartDataResponseProvider {

  providerChartData: {
    label: string[];
    amount: number[];
  }

}

export interface IProviderBookings {
  user: string;
  event: string;
  service: string;
  deliveryDate: Date;
  tag: string;
  totalCount: number;
  orderDate: Date;
  services: IBookedServices[];
}

export interface IPaymentList {
  user: string;
  event?: string;
  service?: string;
  bookingDate: Date;
  totalAmount: number;
  isConfirmed: boolean;
}


export interface IBookingAdminData {
  bookingData: {
    type: string;
    customer: string;
    date: Date;
    isConfirmed: boolean;
  }[];
  oldBookings: number;
  upcomingBookings: number;
  totalRevenue: number;
  totalBooking: number;
}

export interface IProviderSales {
  servicesSales: ISales[];
  serviceSalesCount: number;
}

export interface IRepository<T> {
  createBooking(bookingData: Partial<T>): Promise<T | null>
  getBookingById(bookingId: string): Promise<T | null>
  getAllBooking(query: FilterQuery<T>, options: QueryOptions): Promise<T[] | null>
  updateBooking(bookingId: string, data: UpdateQuery<T>): Promise<T | null>
  deleteBooking(bookingId: string): Promise<DeleteResult | null>
}

export interface IBookingRepository {
  createBooking(bookingData: Partial<IBooking>): Promise<IBooking | null>
  getBookingById(bookingId: string): Promise<IBooking | null>
  getAllBooking(query: FilterQuery<IBooking>, options: QueryOptions): Promise<IBooking[] | null>
  updateBooking(bookingId: string, data: UpdateQuery<IBooking>): Promise<IBooking | null>
  deleteBooking(bookingId: string): Promise<DeleteResult | null>
  getTotalBookings(): Promise<number | null>
  getBookingByUserId(id: string): Promise<IBooking[] | null>
  getSalesData(query: FilterQuery<IBooking>, options: QueryOptions): Promise<ISalesData[] | null>
  getProviderSalesData(query: FilterQuery<IBooking>, options: QueryOptions): Promise<IProviderSalesData[] | null>
  getBookingsAndCount(query: FilterQuery<IBooking>, options: QueryOptions): Promise<IBookingsData[] | null>
  getBookingsByProvider(name: string): Promise<IBooking[] | null>
  getTotalBookingData(): Promise<IAdminBookingData[] | null>
  getAdminChartData(filter: string): Promise<IChartsDataAdmin[] | null>
  getProviderChartData(filter: string, id: string): Promise<IChartsDataProvider[] | null>
  getPaymentList(): Promise<IPaymentList[] | null>
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
  confirmBooking(bookingId: string, paymentType: string): Promise<IResponse>
  verifyPayment(razorpayResponse: IRazorpayResponse): Promise<IResponse>
  getSalesData(params: IRequestParams): Promise<IResponse>
  getProviderSales(params: IRequestParams): Promise<IResponse>
  getBookingsByProvider(name: string): Promise<IResponse>
  getAdminBookingData(): Promise<IResponse>
  getAdminChartData(filter: string): Promise<IResponse>
  getProviderChartData(filter: string, id: string): Promise<IResponse>
  getAdminPaymentList(): Promise<IResponse>
  getProviderBookings(params: IRequestParams, providerId: string): Promise<IResponse>
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
  getBookingsByProvider(req: Request, res: Response, next: NextFunction): Promise<void>
  getAdminBookingData(req: Request, res: Response, next: NextFunction): Promise<void>
  getAdminChartData(req: Request, res: Response, next: NextFunction): Promise<void>
  getProviderChartData(req: Request, res: Response, next: NextFunction): Promise<void>
  getAdminPaymentList(req: Request, res: Response, next: NextFunction): Promise<void>
  getProviderBookings(req: Request, res: Response, next: NextFunction): Promise<void>
}

export interface IPaymentService {
  createOrder(bookingId: string, amount: number): Promise<string | null>
  verifyOrder(razorpayResponse: IRazorpayResponse): Promise<boolean>
}

export const CONTROLLER_RESPONSES = {
  commonError: 'Something went wrong.',
  internalServerError: 'Internal server error'
}

export const SERVICE_RESPONSES = {
  commonError: 'Something went wrong.',
  totalBookingError: 'Could not get the total document',
  addBookingSuccess: 'Booking added successfully',
  addBookingError: 'Could not create service',
  fetchDataError: 'Fetching data failed. Try again.',
  deleteBookingSuccess: 'Booking deleted successfuly. Amount would be refunded to original payment method.',
  deleteBookingError: 'Could not delete booking, Something went wrong',
  deleteServicesSuccess: 'Booked service deleted successfuly',
  deleteServicesError: 'Could not delete booked service, Something went wrong',
  getBookingError: 'Could not get booking, Something went wrong',
  editBookingSuccess: 'Booking updated successfuly',
  editBookingError: 'Could not updated booking',
  editStatusSuccess: 'Booking status updated',
  editStatusError: 'Could not updated booking status',
  getServiceError: 'Could not get booked service',
  getEventsError: 'Could not get booked events',
  proceedPaymentError: 'Could not proceed payment. Try again.',
  paymentSuccess: 'Payment Successful.',
  paymentError: 'Payment failed. Try again.'
}