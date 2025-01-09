import express, { Router } from "express";
import cors from "cors";
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import multer from "multer";
import bookingController from "../controllers/bookingController";
import path from "path";

const router=Router()
const bookingRoute=express()

bookingRoute.use(cookieParser())
bookingRoute.use(express.json({limit:'50mb'}))
// bookingRoute.use('../public', express.static(path.join(__dirname, 'public')));
// bookingRoute.use(express.static(path.join(__dirname, 'public')));
bookingRoute.use('/uploads',express.static('src/public'));
bookingRoute.use(bodyParser.urlencoded({limit:'50mb',extended:true}))
bookingRoute.use(cors())

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

router.get('/bookings/count',bookingController.getTotalBookings)
router.get('/bookings',bookingController.getAllBookings)
router.get('/service/:name/:providerId',bookingController.getEventService)
router.get('/bookings/:name',bookingController.getBookingsByName)

router.get('/:id',bookingController.getBookingById)

router.post('/new',upload.single('img'),bookingController.createBooking)


// while using patch method,more specific routes should come before general ones:
router.patch('/status',bookingController.editStatus)

// router.patch('/approve',bookingController.approveService)

router.patch('/:id',upload.single('img'),bookingController.editBooking)

router.delete('/:id',bookingController.deleteBooking) 


bookingRoute.use(router)

export default bookingRoute 