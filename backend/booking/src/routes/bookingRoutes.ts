import express, { Router,Request,Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import multer from "multer";
// import bookingController from "../controllers/bookingController";
import path from "path";
import { BookingRepository } from "../repository/bookingRepository";
import { BookingService } from "../services/bookingServices";
import { EmailService } from "../services/emailService";
import { BookingController } from "../controllers/bookingController";
import { PaymentService } from "../services/paymentService";

const router=Router()
const bookingRoute=express()

const bookingRepository=new BookingRepository()
const emailService=new EmailService()
const paymentService=new PaymentService()
const bookingService=new BookingService(bookingRepository,emailService,paymentService)
const bookingController= new BookingController(bookingService)

bookingRoute.use(cookieParser())
bookingRoute.use(express.json({limit:'50mb'}))

// bookingRoute.use('../public', express.static(path.join(__dirname, 'public')));
// bookingRoute.use(express.static(path.join(__dirname, 'public')));

bookingRoute.use('/uploads',express.static('src/public'));
bookingRoute.use(bodyParser.urlencoded({limit:'50mb',extended:true}))
bookingRoute.use(cors())

// router.get('/bookings/count',bookingController.getTotalBookings)
// router.get('/bookings',bookingController.getAllBookings)
// router.get('/events',bookingController.getAllEvents)
// router.get('/events/service/:name',bookingController.getServiceByEvent)
// router.get('/service/:name/:providerId',bookingController.getEventService)
// // router.get('/bookings/:name',bookingController.getBookingsByName)

// router.get('/user/:id',bookingController.getBookingByUserId)
// router.get('/:id',bookingController.getBookingById)

// router.post('/new',bookingController.createBooking)


// // while using patch method,more specific routes should come before general ones:
// router.patch('/status',bookingController.editStatus)

// // router.patch('/approve',bookingController.approveService)

// // router.patch('/:id',upload.single('img'),bookingController.editBooking)

// router.delete('/service/:bookingId/:serviceName/:serviceId',bookingController.deleteBookedServices) 
// router.delete('/:id',bookingController.deleteBooking) 


router.get('/bookings/count',(req:Request,res:Response,next:NextFunction)=>bookingController.getTotalBookings(req,res,next))
router.get('/bookings',(req:Request,res:Response,next:NextFunction)=>bookingController.getAllBookings(req,res,next))
router.get('/events',(req:Request,res:Response,next:NextFunction)=>bookingController.getAllEvents(req,res,next))
router.get('/providerSales',(req:Request,res:Response,next:NextFunction)=>bookingController.getProviderSales(req,res,next))
router.get('/salesData/admin',(req:Request,res:Response,next:NextFunction)=>bookingController.getSalesData(req,res,next)) 
router.get('/adminData',(req:Request,res:Response,next:NextFunction)=>bookingController.getAdminBookingData(req,res,next)) 

router.get('/events/service/:name',(req:Request,res:Response,next:NextFunction)=>bookingController.getServiceByEvent(req,res,next))
router.get('/service/:name/:providerId',(req:Request,res:Response,next:NextFunction)=>bookingController.getEventService(req,res,next))
router.get('/user/:id',(req:Request,res:Response,next:NextFunction)=>bookingController.getBookingByUserId(req,res,next))
router.get('/bookings/:providerId',(req:Request,res:Response,next:NextFunction)=>bookingController.getBookingsByProvider(req,res,next))
router.get('/chartDataAdmin/:filter',(req:Request,res:Response,next:NextFunction)=>bookingController.getAdminChartData(req,res,next))
router.get('/chartDataProvider/:filter/:name',(req:Request,res:Response,next:NextFunction)=>bookingController.getProviderChartData(req,res,next))

router.post('/new',(req:Request,res:Response,next:NextFunction)=>bookingController.createBooking(req,res,next)) 
router.post('/confirm',(req:Request,res:Response,next:NextFunction)=>bookingController.confirmBooking(req,res,next))
router.post('/verifyPayment',(req:Request,res:Response,next:NextFunction)=>bookingController.verifyPayment(req,res,next))

router.patch('/status',(req:Request,res:Response,next:NextFunction)=>bookingController.editStatus(req,res,next))

router.delete('/service/:bookingId/:serviceName/:serviceId',(req:Request,res:Response,next:NextFunction)=>bookingController.deleteBookedServices(req,res,next)) 

router.route('/:id')
.get((req:Request,res:Response,next:NextFunction)=>bookingController.getBookingById(req,res,next))
.delete((req:Request,res:Response,next:NextFunction)=>bookingController.deleteBooking(req,res,next))

bookingRoute.use(router)

export default bookingRoute 