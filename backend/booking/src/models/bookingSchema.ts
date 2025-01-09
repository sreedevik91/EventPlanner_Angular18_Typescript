import { model, Schema } from "mongoose";
import { IBooking } from "../interfaces/bookingInterfaces";


const BookingSchema: Schema<IBooking> = new Schema<IBooking>({

  user: {
    type: String,
    required: true
  },
  // userId: {
  //   type: String,
  //   required: true
  // },
  service: {
    type: String,
    required: function () {
      return !this.event
    }
  },
  // serviceId: {
  //   type: String,
  //   required: function () {
  //     return !this.eventId
  //   }
  // },
  event: {
    type: String,
    required: function () {
      return !this.service
    }
  },
  // eventId: {
  //   type: String,
  //   required: function () {
  //     return !this.serviceId
  //   }
  // },
  services: [{
    serviceName: {
      type: String,
      required: true
    },
    providerName: {
      type: String,
      required: true
    },
    serviceChoiceName: {
      type: String,
      required: true
    },
    serviceChoiceAmount: {
      type: Number,
      required: true
    }
  }],
  deliveryDate: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: true
  },
  totalCount: {
    type: Number,
    required: true
  },
  isConfirmed: {
    type: Boolean,
    default: false
  }
},
  {
    timestamps: true
  }
);


const Event = model<IBooking>('event', BookingSchema)
export default Event

