import { IChat } from "../interfaces/chatInterfaces"
import chatRepository from "../repository/chatRepository";
import { config } from "dotenv";
import { getServiceImgGrpc, getServicesByEventNameGrpc, getServicesByProviderAndName, getServicesByProviderGrpc } from "../grpc/grpcServiceClient";
import { getEventByNameGrpc, getEventImgGrpc, getEventsByGrpc } from "../grpc/grpcEventsClient";
import { getUserByIdGrpc } from "../grpc/grpcUserClient";
import { log } from "console";

config()

class ChatServices {

    async getChatsByUserId(userId: string) {
        try {
            const data = await chatRepository.getChatsByUserId(userId)
            const today = new Date()

            // filter chats only for today
            // const chatDataToday = data.filter((item: any) => {
            //     const chatDate = new Date(item.createdAt)
            //     return (today.getDate() === chatDate.getDate() &&
            //         today.getMonth() === chatDate.getMonth() &&
            //         today.getFullYear() === chatDate.getFullYear()
            //     )
            // })
            
            console.log('getEventById service response: ', data);

            if (data) {
                return { success: true, data: data }
            } else {
                return { success: false, message: 'Could not get booking, Something went wrong' }
            }
        } catch (error: any) {
            console.log('Error from getEventById service: ', error.message);
        }
    }

    async saveChats(data: any) {
        try {
            console.log('new chat to save: ', data);
            const newChat = await chatRepository.createChat(data)
            console.log('new chat: ', newChat);
            if (newChat) {
                return { success: true, data: newChat }
            } else {
                return { success: false, message: 'Could not get booking, Something went wrong' }
            }
        } catch (error: any) {
            console.log('Error from saveChats service: ', error.message);
        }

    }


}

export default new ChatServices()
