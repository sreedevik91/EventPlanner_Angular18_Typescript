import express, { Router,Request,Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import { upload } from "../middlewares/multer";
import { ChatRepository } from "../repository/chatRepository";
import { ChatServices } from "../services/chatServices";
import { ChatController } from "../controllers/chatController";

const router=Router()
const chatRoute=express()

const chatRepository=new ChatRepository()
const chatService=new ChatServices(chatRepository)
const chatController= new ChatController(chatService)

chatRoute.use(cookieParser())
chatRoute.use(express.json({limit:'50mb'}))
chatRoute.use('/uploads',express.static('src/public'));
chatRoute.use(bodyParser.urlencoded({limit:'50mb',extended:true}))
// chatRoute.use(cors())

router.get('/:userId',(req:Request,res:Response,next:NextFunction)=>chatController.getChatsByUserId(req,res,next))
router.post('/upload',upload.single('img'),(req:Request,res:Response,next:NextFunction)=>chatController.uploadToCloudinary(req,res,next))
router.post('/audioUpload',upload.single('audio'),(req:Request,res:Response,next:NextFunction)=>chatController.uploadAudioToCloudinary(req,res,next))

chatRoute.use(router)

export default chatRoute 