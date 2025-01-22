import { IAddress } from "../class/bookingClass";

export interface IRegisterData {
    name: string;
    email: string;
    username: string;
    password: string;
    mobile: number;
}

export interface ILoginData {
    username?: string;
    password?: string;
    name?: string;
    email?: string;
    googleId?: string;
}

export interface IResponse {
    success?: boolean;
    message?: string;
    data?: any;
    extra?: any;
    emailVerified?: boolean;
    wrongCredentials?: boolean;
    blocked?: boolean;
}

export interface ILoggedUserData {
    id: string;
    user: string;
    role: string;
    username: string;
    email: string;
    isActive: boolean;
}

export interface INewServiceData {
    name: string;
    events: string[];
    provider: string;
    choices: IChoice[];
}

export interface IOtpData {
    otp: string;
    expiresIn: string;
}

export interface IUser {
    otpData: IOtpData;
    _id: string;
    name: string;
    email: string;
    username?: string;
    password?: string;
    mobile?: number;
    googleId?: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    isActive: boolean;
    isEmailVerified: boolean;
    isUserVerified: boolean;
}

export interface IService {
    _id: string;
    name: string;
    img: string;
    events: string[];
    provider: string;
    providerName?: string;
    choices: IChoice[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    isActive: boolean;
    isApproved: boolean;
}

interface IChoice {
    choiceName: string;
    choiceType: string;
    choicePrice: number;
    choiceImg: string;
    _id: string;
}

export interface IEvent {
    _id: string;
    name: string;
    img: string;
    services: IEventService[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    isActive: boolean;
}

interface IEventService {
    serviceId: string;
    providerId: string;
}

export interface IAlert {
    alertOn: boolean;
    alertClass: string;
    alertText: string;
    alertMessage: string;
}

export interface ISearchFilter {
    userName?: string;
    userStatus?: string;
    role?: string;
    pageNumber: string;
    pageSize: string;
    sortBy: string;
    sortOrder: string;
}

export interface IEventServiceResponse {
    provider: string;
    providerId: string;
    services: string[];
}

export interface IBookedServices {
    // serviceId: string;
    // providerId: string;
    _id?: string;
    serviceName: string;
    providerName: string;
    choiceName: string;
    choiceType: string;
    choicePrice: string;
}

export interface IBooking {
    _id: string;
    userId: string;
    user: string;
    img: string;
    event?: string;
    style?: string;
    service?: string;
    serviceId?: string;
    providerId?: string;
    eventId?: string;
    services: IBookedServices[];
    deliveryDate: Date;
    venue: IAddress;
    totalCount: number;
    isConfirmed: boolean;
}

export interface IServicesArray {
    service: string;
    name: string;
    price: number;
    providerId: string;
}

export interface IChatJoiningResponse{
    roomId:string;
    message:string;
}