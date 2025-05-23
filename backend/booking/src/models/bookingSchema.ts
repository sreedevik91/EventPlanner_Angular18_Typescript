import { model, Schema, Types } from "mongoose";
import { IBooking } from "../interfaces/bookingInterfaces";


const BookingSchema: Schema<IBooking> = new Schema<IBooking>({

  user: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    // type: Types.ObjectId,
    required: true
  },
  service: {
    type: String,
    required: function () {
      return !this.event
    }
  },
  event: {
    type: String,
    required: function () {
      return !this.service
    }
  },
  style: {
    type: String,
    required: function () {
      return !this.service
    }
  },
  img: {
    type: String,
    required: true
  },
  services: [{
    serviceName: {
      type: String
    },
    providerId: {
      type: String
    },
    providerName: {
      type: String
    },
    choiceName: {
      type: String,
      required: true
    },
    choiceType: {
      type: String
    },
    choicePrice: {
      type: Number,
      required: true
    }
  }],
  deliveryDate: {
    type: Date,
    required: true
  },
  venue: {
    building: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pbNo: {
      type: Number,
      required: true
    }
  },
  tag: {
    type: String,
    required: true
  },
  paymentType: {
    type: String,
    default:'Online Payment'
  },
  totalCount: {
    type: Number,
    required: true
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  orderDate: {
    type: Date
  },
},
  {
    timestamps: true
  }
);


const Event = model<IBooking>('booking', BookingSchema)
export default Event

