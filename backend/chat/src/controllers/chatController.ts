import { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/appError";
import chatServices from "../services/chatServices";


class ChatController {

    constructor() {
        // inorder to make 'this' bound correctly to the class component and not result in undefined bind it with the methods manually
        this.uploadToCloudinary = this.uploadToCloudinary.bind(this);
        this.uploadAudioToCloudinary = this.uploadAudioToCloudinary.bind(this);
    }

    async getChatsByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params
            console.log('userId to get chats: ', userId);
            
            let chats = await chatServices.getChatsByUserId(userId)
            if (!chats || !chats.success) {
                return next(new AppError(chats?.message || 'Some error occured while processing the data', 400))
            }

            res.status(200).json(chats)
        } catch (error: any) {
            console.log('Error from getEventById : ', error.message);
            next(new AppError(error.message, 500))

        }

    }

    async uploadToCloudinary(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('chat data from angular: ', req.body);

            console.log('chat image to register: ', req.file);
            const img= req.file?.path
            const name= req.file?.originalname
            const type= await this.getFileType(req.file?.mimetype!)

            let imgUrlData = await chatServices.uploadToCloudinary(img!,name!,type!)
            console.log('cloudinary imgUrl controller response: ', imgUrlData);
            
            if (!imgUrlData || !imgUrlData.success) {
                return next(new AppError(imgUrlData?.message || 'Some error occured while processing the data', 400))
            }

            res.status(200).json(imgUrlData)

        } catch (error: any) {
            console.log('Error from getEventById : ', error.message);
            next(new AppError(error.message, 500))

        }
    }
    
    async uploadAudioToCloudinary(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('audio data from angular: ', req.file);
            const audio= req.file?.path
            const name= req.file?.originalname
            let audioUrlData = await chatServices.uploadAudioToCloudinary(audio!,name!)
            console.log('cloudinary audioUrl controller response: ', audioUrlData);
            
            if (!audioUrlData || !audioUrlData.success) {
                return next(new AppError(audioUrlData?.message || 'Some error occured while processing the data', 400))
            }

            res.status(200).json(audioUrlData)

        } catch (error: any) {
            console.log('Error from getEventById : ', error.message);
            next(new AppError(error.message, 500))

        }
    }

    async getFileType(mimetype:string){
        if(mimetype.startsWith('image/')) return 'image'
        if(mimetype.startsWith('video/')) return 'video'
        return 'raw'
    }

}

export default new ChatController()