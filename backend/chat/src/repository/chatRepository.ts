import { DeleteResult } from "mongoose";
import { IChat} from "../interfaces/chatInterfaces";
import Chat from "../models/chatSchema";
import BaseRepository from "./baseRepository";


class ChatRepository extends BaseRepository<IChat> {

    constructor() {
        super(Chat)
    }

    async getChatsByUserId(id: string):Promise<IChat | null> {
        let chats =await Chat.findOne({userId:id})
        return chats
    } 


    async getChatsByRoomId(roomId: string):Promise<IChat | null> {
        let chats =await Chat.findOne({roomId})
        return chats
    } 

}

export default new ChatRepository()