import mongoose, { model, Schema }  from "mongoose";
import { IService, IServiceDb } from "../interfaces/serviceInterfaces";


const ServiceSchema:Schema<IService> = new Schema<IService>({
name:{
    type:String,
    required:true
},
  eventId: [{
    type: Schema.Types.ObjectId
  }],
  providerId: [{
    type: Schema.Types.ObjectId
  }],
  choices: [{
    name: {
      type: String
    },
    type: {
      type: String
    },
    price: {
      type: Number
    }
  }],
  isApproved: {
    type: Boolean
  },
  isActive: {
    type: Boolean
  } 
},
{
    timestamps:true
}
);

const Service= model<IService>('service',ServiceSchema)
export default Service