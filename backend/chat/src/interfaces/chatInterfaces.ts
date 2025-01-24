import { Date, Document } from "mongoose";

export interface IChat extends Document {
  _id: string;
  userId: string;
  roomId:string;
  chats: IUserChat[];
}
export interface IUserChat {
  sender:string;
  receiver?:string;
  message: string;
  date: Date;
}


