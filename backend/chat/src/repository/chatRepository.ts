import { DeleteResult } from "mongoose";
import { IChat} from "../interfaces/chatInterfaces";
import Chat from "../models/chatSchema";
import BaseRepository from "./baseRepository";


class ChatRepository extends BaseRepository<IChat> {

    constructor() {
        super(Chat)
    }

    async getChatsByUserId(id: string):Promise<IChat[]> {
        let chats =await Chat.find({userId:id})
        return chats
    } 

}

export default new ChatRepository()