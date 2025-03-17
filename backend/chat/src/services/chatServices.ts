import { IChat, IChatRepository, IChatService, SERVICE_RESPONSES } from "../interfaces/chatInterfaces"
// import chatRepository from "../repository/chatRepository";
import { config } from "dotenv";
import { getAudioUrl, getImgVideoUrl } from "../utils/cloudinary";

config()

export class ChatServices implements IChatService {

    constructor(private chatRepository: IChatRepository) { }

    async getChatsByUserId(userId: string) {
        try {
            const data = await this.chatRepository.getChatsByUserId(userId)
            const today = new Date()

            // filter chats only for today
            // const chatDataToday = data.filter((item: any) => {
            //     const chatDate = new Date(item.createdAt)
            //     return (today.getDate() === chatDate.getDate() &&
            //         today.getMonth() === chatDate.getMonth() &&
            //         today.getFullYear() === chatDate.getFullYear()
            //     )
            // })

            console.log('getChatsByUserId service response: ', data);

            if (data) {
                return { success: true, data: data }
            } else {
                return { success: false, message:SERVICE_RESPONSES.getChatError }
            }
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getChatsByUserId service: ', error.message ) : console.log('Unknown error from getChatsByUserId service: ', error );
            return { success: false, message: SERVICE_RESPONSES.commonError}

        }
    }

    async saveChats(data: IChat) {
        try {
            console.log('new chat to save: ', data);
            // const prevChats = await chatRepository.getChatsByUserId(data.userId)
            const prevChats = await this.chatRepository.getChatsByRoomId(data.roomId)
            console.log('prevChats: ', prevChats);

            if (prevChats && (Object.keys(prevChats)).length > 0) {
                const updateChat = await this.chatRepository.updateChat(prevChats._id, { $push: { chats: data.chats } })
                return { success: true, data: updateChat }
            } else {
                const newChat = await this.chatRepository.createChat(data)
                console.log('new chat: ', newChat);
                if (newChat) {
                    return { success: true, data: newChat }
                } else {
                    return { success: false, message:SERVICE_RESPONSES.saveChatError }
                }
            }

        } catch (error: unknown) {
             error instanceof Error ? console.log('Error message from saveChats service: ', error.message ) : console.log('Unknown error from saveChats service: ', error )
            return { success: false, message: SERVICE_RESPONSES.commonError}

        }

    }

    async uploadToCloudinary(img: string, name: string, type: "image" | "video" | "raw" | "auto" | undefined) {

        try {
            // const result= await cloudinary.uploader.upload(img,{public_id:name, resource_type:type})
            // console.log('cloudinary img/video upload result: ', result);

            const uploadImgVideo = await getImgVideoUrl(img, { public_id: name, resource_type: type, type:"authenticated",sign_url: true })
            console.log('cloudinary img/video upload result: ', uploadImgVideo);
            return uploadImgVideo

        } catch (error: unknown) {
             error instanceof Error ? console.log('Error message from uploadToCloudinary service: ', error.message ) : console.log('Unknown error from uploadToCloudinary service: ', error )
            return { success: false, message: SERVICE_RESPONSES.commonError}

        }
    }

    async uploadAudioToCloudinary(audio: string, name: string) {

        try {
            // to process audio file resource_type should be mentioned as 'video'

            // const result= await cloudinary.uploader.upload(audio,{public_id:name, resource_type:'video'})
            // console.log('cloudinary audio upload result: ', result);
            // return { success: true, data: {imgUrl:result?.url, type:'audio'} }

            const uploadAudio = await getAudioUrl(audio, { public_id: name, resource_type: 'video',type:"authenticated",sign_url: true})
            console.log('cloudinary audio upload result: ', uploadAudio);
            return uploadAudio

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from uploadAudioToCloudinary service: ', error.message ) : console.log('Unknown error from uploadAudioToCloudinary service: ', error )
            return { success: false, message: SERVICE_RESPONSES.commonError}

        }
    }


}

// export default new ChatServices()
