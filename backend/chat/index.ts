
import express from "express";
import { config } from "dotenv";
import connectDb from "./src/config/db";
import chatRoute from "./src/routes/chatRoutes";
import { errorHandler } from "./src/middlewares/errorHandler";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { handleSocketConnection } from "./src/socket/chatSocket";

const app=express()

const httpServer=createServer(app)

const io=new Server(httpServer,{
    cors:{
        origin:"*"
    },
    transports: ['websocket', 'polling']
})

handleSocketConnection(io)

config()
connectDb()

app.use(express.json())
app.use('/',chatRoute)
// app.use('/api/chat',chatRoute)
app.use(errorHandler)

httpServer.listen(process.env.PORT || 3005, () => {
    console.log('chat server running on port 3005');
})

