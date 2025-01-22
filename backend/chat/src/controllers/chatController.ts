import { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/appError";
import chatServices from "../services/chatServices";


class ChatController {

    async getChatsByUserId(req: Request, res: Response, next:NextFunction){
        try {
            const {userId}=req.params
            let chats = await chatServices.getChatsByUserId(userId)
            if(!chats || !chats.success){
                return next(new AppError(chats?.message || 'Some error occured while processing the data', 400))
            }
    
            res.status(200).json(chats) 
        }catch (error: any) {
            console.log('Error from getEventById : ', error.message);
            next(new AppError(error.message,500))

        }
       
    }



}

export default new ChatController()