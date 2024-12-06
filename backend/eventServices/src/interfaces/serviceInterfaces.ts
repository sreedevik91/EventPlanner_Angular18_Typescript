export interface IService {
    name: string;
    eventId: string[];
    providerId: string[];
    choices: IChoice[];
    isApproved: boolean;
    isActive: boolean;
}
export interface IChoice {
    name: string;
    type: string;
    price: number;
}

export interface IServiceDb extends IService {
    _id: string
}