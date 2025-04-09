
import express from "express";
import { config } from "dotenv";
import connectDb from "./src/config/db";
import chatRoute from "./src/routes/chatRoutes";
import { errorHandler } from "./src/middlewares/errorHandler";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { handleSocketConnection } from "./src/socket/chatSocket";

const app=express()

app.set('trust proxy', true);

const httpServer=createServer(app)

const io=new Server(httpServer,{
    // cors:{
    //     origin:"*"
    // },

    cors: {
        origin: "https://dreamevents.shop",
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling']
})

handleSocketConnection(io)

config()
connectDb()

app.use(express.json())

app.get('/health', (req, res) => {
    res.status(200).send('Welcome to chat service');
  });

app.use('/',chatRoute)
app.use(errorHandler)

httpServer.listen(Number(process.env.PORT) || 3005,"0.0.0.0", () => {
    console.log('chat server running on port 3005');
})

