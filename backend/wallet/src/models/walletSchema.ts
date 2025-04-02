import { model, Schema, Types } from "mongoose";
import {IWallet } from "../interfaces/walletInterfaces";


const WalletSchema: Schema<IWallet> = new Schema<IWallet>({
  userId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  transactions: [{
    type: {
      type: String,
      required: true,
      enum: ['credit', 'debit']
    },
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now()
    }
  }]
},
  {
    timestamps: true
  }
);


const Event = model<IWallet>('wallet', WalletSchema)
export default Event

