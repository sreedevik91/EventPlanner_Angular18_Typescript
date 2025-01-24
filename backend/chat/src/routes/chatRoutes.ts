import express, { Router } from "express";
import cors from "cors";
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import multer from "multer";
import chatController from "../controllers/chatController";
import path from "path";

const router=Router()
const chatRoute=express()

chatRoute.use(cookieParser())
chatRoute.use(express.json({limit:'50mb'}))
// chatRoute.use('../public', express.static(path.join(__dirname, 'public')));
// chatRoute.use(express.static(path.join(__dirname, 'public')));
chatRoute.use('/uploads',express.static('src/public'));
chatRoute.use(bodyParser.urlencoded({limit:'50mb',extended:true}))
chatRoute.use(cors())

router.get('/:userId',chatController.getChatsByUserId)


// router.get('/bookings/count',bookingController.getTotalBookings)
// router.get('/bookings',bookingController.getAllBookings)
// router.get('/events',bookingController.getAllEvents)

// router.get('/events/service/:name',bookingController.getServiceByEvent)
// router.get('/service/:name/:providerId',bookingController.getEventService)
// // router.get('/bookings/:name',bookingController.getBookingsByName)

// router.get('/user/:id',bookingController.getBookingByUserId)


// router.post('/new',bookingController.createBooking)


// // while using patch method,more specific routes should come before general ones:
// router.patch('/status',bookingController.editStatus)

// // router.patch('/approve',bookingController.approveService)

// // router.patch('/:id',upload.single('img'),bookingController.editBooking)

// router.delete('/service/:bookingId/:serviceName/:serviceId',bookingController.deleteBookedServices) 

// router.delete('/:id',bookingController.deleteBooking) 


chatRoute.use(router)

export default chatRoute 