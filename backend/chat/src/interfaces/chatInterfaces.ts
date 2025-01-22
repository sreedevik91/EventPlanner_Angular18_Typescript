import { Date, Document } from "mongoose";

export interface IChat extends Document {
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

export interface IChatDb extends IChat, Document {
  _id: string;
}
