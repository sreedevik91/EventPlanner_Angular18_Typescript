import { model, Schema } from "mongoose";
import { IChat } from "../interfaces/chatInterfaces";


const ChatSchema: Schema<IChat> = new Schema<IChat>({

  userId: {
    type: String,
    required: true
  },
  roomId: {
    type: String,
    // required: true
  },
  chats: {
    sender: {
      type: String
    },
    receiver: {
      type: String
    },
    message: {
      type: String
    },
    date: {
      type: Date
    }
  }
},
  {
    timestamps: true
  }
);


const Chat = model<IChat>('chat', ChatSchema)
export default Chat

