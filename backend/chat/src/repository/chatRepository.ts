import { DeleteResult } from "mongoose";
import { IChat, IChatRepository} from "../interfaces/chatInterfaces";
import Chat from "../models/chatSchema";
import BaseRepository from "./baseRepository";


export class ChatRepository extends BaseRepository<IChat> implements IChatRepository {

    constructor() {
        super(Chat)
    }

    async getChatsByUserId(userId: string):Promise<IChat | null> {
        let chats =await Chat.findOne({userId})
        return chats
    } 


    async getChatsByRoomId(roomId: string):Promise<IChat | null> {
        let chats =await Chat.findOne({roomId})
        return chats
    } 

}

export default new ChatRepository()