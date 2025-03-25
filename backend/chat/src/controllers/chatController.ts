import { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/appError";
// import chatServices from "../services/chatServices";
import { CONTROLLER_RESPONSES, HttpStatusCodes, IChatController, IChatService } from "../interfaces/chatInterfaces";
import { getFileType } from "../utils/cloudinary";
import { ResponseHandler } from "../middlewares/responseHandler";


export class ChatController implements IChatController {

    constructor(private chatServices: IChatService) {
        // inorder to make 'this' bound correctly to the class component and not result in undefined bind it with the methods manually
        this.uploadToCloudinary = this.uploadToCloudinary.bind(this);
        this.uploadAudioToCloudinary = this.uploadAudioToCloudinary.bind(this);
    }

    async getChatsByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params
            console.log('userId to get chats: ', userId);

            let chats = await this.chatServices.getChatsByUserId(userId)

            // if (!chats || !chats.success) {
            //     return next(new AppError(chats?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(chats)

            // chats?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, chats) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, chats)
            chats?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, chats) : next(new AppError(chats))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getChatsByUserId controller: ', error.message) : console.log('Unknown error from getChatsByUserId controller: ', error)
            // next(new AppError(error.message, 500))
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }

    }

    async uploadToCloudinary(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('chat data from angular: ', req.body);

            console.log('chat image to register: ', req.file);
            const img = req.file?.path
            const name = req.file?.originalname
            const type = await getFileType(req.file?.mimetype!)

            let imgUrlData = await this.chatServices.uploadToCloudinary(img!, name!, type!)
            console.log('cloudinary imgUrl controller response: ', imgUrlData);

            // if (!imgUrlData || !imgUrlData.success) {
            //     return next(new AppError(imgUrlData?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(imgUrlData)

            // imgUrlData?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, imgUrlData) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, imgUrlData)
            imgUrlData?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, imgUrlData) : next(new AppError(imgUrlData))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from uploadToCloudinary controller: ', error.message) : console.log('Unknown error from uploadToCloudinary controller: ', error)
            // next(new AppError(error.message, 500))
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }
    }

    async uploadAudioToCloudinary(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('audio data from angular: ', req.file);
            const audio = req.file?.path
            const name = req.file?.originalname
            let audioUrlData = await this.chatServices.uploadAudioToCloudinary(audio!, name!)
            console.log('cloudinary audioUrl controller response: ', audioUrlData);

            // if (!audioUrlData || !audioUrlData.success) {
            //     return next(new AppError(audioUrlData?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(audioUrlData)

            // audioUrlData?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, audioUrlData) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, audioUrlData)
            audioUrlData?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, audioUrlData) : next(new AppError(audioUrlData))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from uploadAudioToCloudinary controller: ', error.message) : console.log('Unknown error from uploadAudioToCloudinary controller: ', error)
            // next(new AppError(error.message, 500))
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }
    }

    // async getFileType(mimetype:string){
    //     if(mimetype.startsWith('image/')) return 'image'
    //     if(mimetype.startsWith('video/')) return 'video'
    //     return 'raw'
    // }

}

// export default new ChatController()