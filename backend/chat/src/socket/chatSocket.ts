
import { Server, Socket } from "socket.io";
import { ChatServices } from "../services/chatServices";
import { getUserByIdGrpc } from "../grpc/grpcUserClient";
import { ChatRepository } from "../repository/chatRepository";
import { IChat } from "../interfaces/chatInterfaces";

const rooms: Record<string,string> = {}
const activeUsers:Set<string> = new Set()
let messages:IChat[]=[]

const chatRepository=new ChatRepository()
const chatServices=new ChatServices(chatRepository)

export const handleSocketConnection = (io: Server) => {

    io.on('connection', (socket: Socket) => {

        console.log('User connected');

        socket.on('startChat', ({ userName, userId }) => {
            const roomId = `room_${userId}`
            rooms[userId] = roomId
            activeUsers.add(userId)
            socket.join(roomId)
            console.log(`${userName} joined room ${roomId}`);
            socket.to(roomId).emit('startChatNotification', { roomId, message: `${userName} started the chat` })
            // console.log(`updatedActiveUsers: `, Array.from(activeUsers));
            io.to(roomId).emit('roomId', roomId)
        })

        socket.on('getActiveUsers', async () => {
            console.log(`updatedActiveUsers: `, Array.from(activeUsers));
            const usersArray:string[]=Array.from(activeUsers)
            const userDetailArray:{userId:string,userName:string}[]=[]
            for(let userId of usersArray){
                const userData= await getUserByIdGrpc(userId)
                userDetailArray.push({userId,userName:userData.name})
            }
            console.log('userDetailArray: ', userDetailArray);
            
            io.emit('updatedActiveUsers', userDetailArray)     
        })

        socket.on('joinChat', ({ userId }) => {
            const roomId=rooms[userId]
            socket.join(roomId)
            console.log(`Admin joined room ${roomId}`);
            socket.to(roomId).emit('joiningNotification', { roomId, message: `Admin joined the chat` })
            // io.to(roomId).emit('roomId', roomId)
            io.to(roomId).emit('receiveUserMessage', messages)
        })

        socket.on('sendMessage', async (data) => {
            console.log(data);
            const roomId=rooms[data.userId]
            console.log('user roomId: ',roomId);
            data.roomId=roomId
            const saveChat = await chatServices.saveChats(data)
            console.log('saved chat: ', saveChat);
            messages.push(data)
            io.to(roomId).emit('receivedMessage', data)
            // io.emit('receivedMessage', data)
        })

        socket.on('adminSentMessage', async ({userId,data}) => {
            console.log(data);
            const roomId=rooms[userId]
            console.log('admin roomId: ',roomId);
            data.roomId=roomId
            const saveChat = await chatServices.saveChats(data)
            console.log('saved chat: ', saveChat,socket.id);
            io.to(roomId).emit('receivedMessage', data)
            // io.emit('receivedMessage', data)
        })

        socket.on('typing', ({ userName, userId }) => {
            const roomId=rooms[userId]
            socket.to(roomId).emit('typingNotification', `${userName} is typing ...`)
        })

        socket.on('leaveChat', ({ userName, userId }) => {
            const roomId=rooms[userId]
            activeUsers.delete(userId)
            delete rooms[userId]
            messages=[]
            socket.to(roomId).emit('leavingNotification', `${userName} has left the chat ...`)
            io.emit('updatedActiveUsers', Array.from(activeUsers))
        })

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message);
        });

    })
}