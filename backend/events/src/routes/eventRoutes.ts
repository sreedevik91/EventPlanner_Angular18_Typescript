import express, {  NextFunction, Request, Response,Router } from "express";
import cors from "cors";
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import multer from "multer";
import { EventController } from "../controllers/eventController";
import path from "path";
import { upload } from "../middlewares/multer";
import { EventRepository } from "../repository/eventRepository";
import { EventServices } from "../services/eventServices";
import { EmailService } from "../services/emailService";

const router=Router()
const eventRoute=express()

const eventRepository=new EventRepository()
const emailService=new EmailService()
const eventService=new EventServices(eventRepository,emailService)
const eventController= new EventController(eventService)

eventRoute.use(cookieParser())
eventRoute.use(express.json({limit:'50mb'}))
eventRoute.use('/uploads',express.static('src/public'));
eventRoute.use(bodyParser.urlencoded({limit:'50mb',extended:true}))
eventRoute.use(cors())

router.get('/events/count',(req:Request,res:Response,next:NextFunction)=>eventController.getTotalEvents(req,res,next))
router.get('/events',(req:Request,res:Response,next:NextFunction)=>eventController.getAllEvents(req,res,next))
router.get('/service/:name',(req:Request,res:Response,next:NextFunction)=>eventController.getEventServiceByName(req,res,next))
router.get('/events/:name',(req:Request,res:Response,next:NextFunction)=>eventController.getEventsByName(req,res,next))
router.patch('/status',(req:Request,res:Response,next:NextFunction)=>eventController.editStatus(req,res,next))
router.post('/new',upload.single('img'),(req:Request,res:Response,next:NextFunction)=>eventController.createEvent(req,res,next))

router.route('/:id')
.get((req:Request,res:Response,next:NextFunction)=>eventController.getEventById(req,res,next))
.patch(upload.single('img'),(req:Request,res:Response,next:NextFunction)=>eventController.editEvent(req,res,next))
.delete((req:Request,res:Response,next:NextFunction)=>eventController.deleteEvent(req,res,next))

eventRoute.use(router)

export default eventRoute 