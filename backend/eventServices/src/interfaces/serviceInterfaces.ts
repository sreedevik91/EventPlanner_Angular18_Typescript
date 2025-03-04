import { DeleteResult, Document, FilterQuery, QueryOptions } from "mongoose";
import { Request, Response } from "express"

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
export interface IChoice {
    choiceName: string;
    choiceType: string;
    choicePrice: number;
    choiceImg: string;
    choiceImgCategory?:string;
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
    sortOrder?: string
}

export interface IServiceDb extends IService, Document {
    _id: string;
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

export interface IServicesData{
    services:IService[];
    servicesCount:{totalServices:number}[];
  }

export interface IRepository<T> {
    // getAllUsers(filter:any,sort:any,limit:number,skip:number): Promise<T[]>;
    getAllServices(query: FilterQuery<T>, options: QueryOptions): Promise<T[] | null>;
    getServiceById(serviceId: string): Promise<T | null>;
    createService(serviceData: Partial<T>): Promise<T>;
    updateService(serviceId: string, service: Partial<T>): Promise<T | null>;
    deleteService(serviceId: string): Promise<DeleteResult | null>;
}

export interface IServiceRepository {
    getAllServices(query: FilterQuery<IService>, options: QueryOptions): Promise<IService[]>;
    createService(service: Partial<IService>): Promise<IService>;
    getServiceById(serviceId: string): Promise<IService | null>;
    updateService(serviceId: string, service: Partial<IService>): Promise<IService | null>;
    deleteService(serviceId: string): Promise<DeleteResult | null>;
    getTotalServices(): Promise<number>;
    getServiceByProviderOld(providerId: string): Promise<IService | null>
    getAllServiceByEventName(name: string): Promise<IService[]>
    getServiceByProvider(name: string, providerId: string): Promise<IService | null>
    getAllServiceByProvider(id: string): Promise<IService[]>
    getServiceByName(name: string): Promise<IAggregateResponse[]>
    getServicesAndCount(filter: FilterQuery<IService>,  options: QueryOptions): Promise<IServicesData[]>;
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
}

export interface IServiceController {
    getTotalServices(req: Request, res: Response): Promise<void>
    createService(req: Request, res: Response): Promise<void>
    getAllServices(req: Request, res: Response): Promise<void>
    deleteService(req: Request, res: Response): Promise<void>
    getServiceById(req: Request, res: Response): Promise<void>
    editService(req: Request, res: Response): Promise<void>
    approveService(req: Request, res: Response): Promise<void>
    getServiceByName(req: Request, res: Response): Promise<void>
}
