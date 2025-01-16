import { Date, Document} from "mongoose";

export interface IBooking extends Document {
    userId:string;
    user:string;
    serviceId?: string;
    providerId?: string;
    service?: string;
    img:string;
    eventId?:string;
    event?:string;
    style?:string;
    services:IBookedServices[];
    deliveryDate:Date;
    venue: IAddress;
    totalCount:number;
    isConfirmed: boolean;
    tag:string; // if there is eventId in the data from frontend then tag is event booking or if serviceId there then it is service booking 
}
export interface IBookedServices {
    // serviceId: string;
    _id?:string,
    providerId?: string;
    serviceName:string;
    providerName:string;
    serviceChoiceName:string;
    serviceChoiceType:string;
    serviceChoiceAmount:number;
}

interface IAddress{
  building: string;
  street:string;
  city:string;
  district:string;
  state:string;
  pbNo:number;
}

export interface IEvent {
  _id:string;     
  name:string;   
  services:string[]; 
  isActive:string;
}

export interface IBookingDb extends IBooking,Document {
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

  export interface IChoice{
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