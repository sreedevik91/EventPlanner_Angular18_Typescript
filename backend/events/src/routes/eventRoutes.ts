import express, { Router } from "express";
import cors from "cors";
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import multer from "multer";
import eventController from "../controllers/eventController";
import path from "path";

const router=Router()
const eventRoute=express()

eventRoute.use(cookieParser())
eventRoute.use(express.json({limit:'50mb'}))
// eventRoute.use('../public', express.static(path.join(__dirname, 'public')));
// eventRoute.use(express.static(path.join(__dirname, 'public')));
eventRoute.use('/uploads',express.static('src/public'));
eventRoute.use(bodyParser.urlencoded({limit:'50mb',extended:true}))
eventRoute.use(cors())

const Storage=multer.diskStorage({
    destination:function(req,file,cb){
        console.log('imagePath from service routes.ts:', path.join(__dirname, '../public'));
    
        cb(null,path.join(__dirname,'../public'))
    },
    filename:function(req,file,cb){
    
        // const name=Date.now()+'_'+file.originalname
        const name=`${Date.now()}_${file.originalname}`
        cb(null,name)
    }
})

const upload=multer({storage:Storage})

router.get('/events/count',eventController.getTotalEvents)
router.get('/events',eventController.getAllEvents)
router.get('/service/:name',eventController.getEventServiceByName)
router.get('/events/:name',eventController.getEventsByName)

router.get('/:id',eventController.getEventById)

router.post('/new',upload.single('img'),eventController.createEvent)


// while using patch method,more specific routes should come before general ones:
router.patch('/status',eventController.editStatus)

// router.patch('/approve',eventController.approveService)

router.patch('/:id',upload.single('img'),eventController.editEvent)

router.delete('/:id',eventController.deleteEvent) 


eventRoute.use(router)
export default eventRoute 