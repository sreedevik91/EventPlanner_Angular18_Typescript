import mongoose, { model, Schema } from "mongoose";
import { IService, IServiceDb } from "../interfaces/serviceInterfaces";


const ServiceSchema: Schema<IService> = new Schema<IService>({
  name: {
    type: String,
    required: true
  },
  events: [{
    type: String,
    required: true
  }],
  provider: {
    type: String,
    required: true
  },
  choices: [{                                           
    choiceName: {
      type: String
    },
    choiceType: {
      type: String
    },
    choicePrice: {
      type: Number
    }
  }],
  isApproved: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
},
  {
    timestamps: true
  }
);

const Service = model<IService>('service', ServiceSchema)
export default Service

