import { model, Schema } from "mongoose";
import { IEvent } from "../interfaces/eventInterfaces";


const EventSchema: Schema<IEvent> = new Schema<IEvent>({
  name: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  services: [{
    type: String,
    required: true

  }],
  isActive: {
    type: Boolean,
    default: true
  }
},
  {
    timestamps: true
  }
);


const Event = model<IEvent>('event', EventSchema)
export default Event

