import { DeleteResult } from "mongoose";
import { IChat, IChatRepository} from "../interfaces/chatInterfaces";
import Chat from "../models/chatSchema";
import BaseRepository from "./baseRepository";


export class ChatRepository extends BaseRepository<IChat> implements IChatRepository {

    constructor() {
        super(Chat)
    }

    async getChatsByUserId(userId: string):Promise<IChat | null> {
        // let chats =await Chat.findOne({userId})
        // let chats=await this.getAllChat({userId}) // can try to reuse base repository method for custom methods, if using change the return type as IChat[] | null
        let chats =await this.model.findOne({userId})
        return chats
    } 

    async getChatsByRoomId(roomId: string):Promise<IChat | null> {
        // let chats =await Chat.findOne({roomId})
        let chats =await this.model.findOne({roomId})
        return chats
    } 

}

// export default new ChatRepository()