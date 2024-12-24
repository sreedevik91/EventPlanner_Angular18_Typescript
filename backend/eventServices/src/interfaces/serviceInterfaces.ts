import { DeleteResult , Document} from "mongoose";

export interface IService extends Document {
    name: string;
    img:string;
    events: string[];
    provider: string;
    choices: IChoice[];
    isApproved: boolean;
    isActive: boolean;
}
export interface IChoice {
    choiceName: string;
    choiceType: string;
    choicePrice: number;
    choiceImg:string;
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


export interface IServiceDb extends IService,Document {
    _id: string;
    // save: () => Promise<IServiceDb>
}

export interface IServiceRepository{
    getAllServices(filter:any,sort:any,limit:number,skip:number):Promise<IService[]>;
    createService(service:IService):Promise<IService>;
    getServiceById(id:string):Promise<IServiceDb | null>;
    updateService(id:string,service:Partial<IService>):Promise<IServiceDb | null>;
    deleteService(id:string):Promise<DeleteResult>;
    getTotalServices():Promise<number>;
}