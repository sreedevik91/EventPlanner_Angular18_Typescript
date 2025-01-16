import { DeleteResult , Document} from "mongoose";

export interface IEvent extends Document {
  _id:string;
    name: string;
    img:string;
    // services:IEventServices[];
    services:string[];
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


export interface IEventDb extends IEvent,Document {
    _id: string;
}

export interface IEventRepository{
    getAllEvents(filter:any,sort:any,limit:number,skip:number):Promise<IEvent[]>;
    createEvents(service:IEvent):Promise<IEvent>;
    getEventById(id:string):Promise<IEventDb | null>;
    updateEvent(id:string,service:Partial<IEvent>):Promise<IEventDb | null>;
    deleteEvent(id:string):Promise<DeleteResult>;
    getTotalEvents():Promise<number>;
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