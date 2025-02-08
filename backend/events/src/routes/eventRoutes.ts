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
// eventRoute.use('../public', express.static(path.join(__dirname, 'public')));
// eventRoute.use(express.static(path.join(__dirname, 'public')));
eventRoute.use('/uploads',express.static('src/public'));
eventRoute.use(bodyParser.urlencoded({limit:'50mb',extended:true}))
eventRoute.use(cors())

// const Storage=multer.diskStorage({
//     destination:function(req,file,cb){
//         console.log('imagePath from service routes.ts:', path.join(__dirname, '../public'));
    
//         cb(null,path.join(__dirname,'../public'))
//     },
//     filename:function(req,file,cb){
    
//         // const name=Date.now()+'_'+file.originalname
//         const name=`${Date.now()}_${file.originalname}`
//         cb(null,name)
//     }
// })

// const upload=multer({storage:Storage})

// router.get('/events/count',eventController.getTotalEvents)
// router.get('/events',eventController.getAllEvents)
// router.get('/service/:name',eventController.getEventServiceByName)
// router.get('/events/:name',eventController.getEventsByName)
// router.get('/:id',eventController.getEventById)

// router.post('/new',upload.single('img'),eventController.createEvent)


// // while using patch method,more specific routes should come before general ones:
// router.patch('/status',eventController.editStatus)
// // router.patch('/approve',eventController.approveService)
// router.patch('/:id',upload.single('img'),eventController.editEvent)

// router.delete('/:id',eventController.deleteEvent) 

router.get('/events/count',(req:Request,res:Response,next:NextFunction)=>eventController.getTotalEvents(req,res,next))
router.get('/events',(req:Request,res:Response,next:NextFunction)=>eventController.getAllEvents(req,res,next))
router.get('/service/:name',(req:Request,res:Response,next:NextFunction)=>eventController.getEventServiceByName(req,res,next))
router.get('/events/:name',(req:Request,res:Response,next:NextFunction)=>eventController.getEventsByName(req,res,next))

router.route('/:id')
.get((req:Request,res:Response,next:NextFunction)=>eventController.getEventById(req,res,next))
.patch(upload.single('img'),(req:Request,res:Response,next:NextFunction)=>eventController.editEvent(req,res,next))
.delete((req:Request,res:Response,next:NextFunction)=>eventController.deleteEvent(req,res,next))

router.post('/new',upload.single('img'),(req:Request,res:Response,next:NextFunction)=>eventController.createEvent(req,res,next))

router.patch('/status',(req:Request,res:Response,next:NextFunction)=>eventController.editStatus(req,res,next))

router.delete('/:id',(req:Request,res:Response,next:NextFunction)=>eventController.deleteEvent(req,res,next)) 

eventRoute.use(router)

export default eventRoute 