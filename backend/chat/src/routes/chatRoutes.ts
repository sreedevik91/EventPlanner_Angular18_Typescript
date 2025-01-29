import express, { Router } from "express";
import cors from "cors";
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import { upload } from "../middlewares/multer";
import chatController from "../controllers/chatController";

const router=Router()
const chatRoute=express()

chatRoute.use(cookieParser())
chatRoute.use(express.json({limit:'50mb'}))
chatRoute.use('/uploads',express.static('src/public'));
chatRoute.use(bodyParser.urlencoded({limit:'50mb',extended:true}))
chatRoute.use(cors())

router.get('/:userId',chatController.getChatsByUserId)
router.post('/upload',upload.single('img'),chatController.uploadToCloudinary)
router.post('/audioUpload',upload.single('audio'),chatController.uploadAudioToCloudinary)

chatRoute.use(router)

export default chatRoute 