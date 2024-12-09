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
    success: boolean;
    message?: string;
    data?: any;
}

export interface ILoggedUserData {
    _id: string;
    user: string;
    role: string;
    username: string;
    email: string;
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
    events: string;
    provider:string;
    choices:IChoice[];
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
}

export interface IAlert {
    alertOn: boolean;
    alertClass: string;
    alertText: string;
    alertMessage: string;
}

export interface ISearchFilter{
    userName?: string;
    userStatus?: string;
    role?: string;
    pageNumber: string;
    pageSize: string;
    sortBy: string;
    sortOrder: string;
}