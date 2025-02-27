import { NextFunction, Request, Response } from "express"
// import bookingServices from "../services/bookingServices";
import { HttpStatusCodes, IBookedServices, IBookingController, IBookingService } from "../interfaces/bookingInterfaces";
import fs from 'fs'
import { AppError } from "../utils/appError";
import { ResponseHandler } from "../middlewares/responseHandler";


export class BookingController implements IBookingController {

    constructor(
        private bookingServices: IBookingService
    ) { }


    async getTotalBookings(req: Request, res: Response, next: NextFunction) {
        try {
            const bookingCount = await this.bookingServices.totalBookings()
            console.log('getTotalServices controller response: ', bookingCount);

            // if(!response || !response.success){
            //     return next(new AppError(response?.message || 'Some error occured while processing the data', 400))
            // }

            // // response?.success ? res.status(200).json(response) : res.status(400).json(response)
            // res.status(200).json(response) 

            bookingCount?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, bookingCount) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, bookingCount)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getTotalServices controller: ', error.message) : console.log('Unknown error from getTotalServices controller: ', error)
            // res.status(500).json(error.message)
            // next(new AppError(error.message,500))
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })

        }

    }

    async createBooking(req: Request, res: Response, next: NextFunction) {

        try {

            console.log('new booking to create from frontend: ', req.body);

            const newBooking = await this.bookingServices.addBooking(req.body)
            console.log('createService controller response: ', newBooking);

            // response?.success ? res.status(200).json(response) : res.status(400).json(response)

            // if (!response || !response?.success) {
            //     return next(new AppError(response?.message || 'Could not perform the required action. Something went wrong', 400))
            // }
            // res.status(200).json(response) 

            newBooking?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.CREATED, newBooking) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, newBooking)


        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from createService controller: ', error.message) : console.log('Unknown error from createService controller: ', error)

            // console.log('Error from createService controller: ', error.message);
            // res.status(500).json(error.message)
            // next(new AppError(error.message,500))
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })

        }

    }

    async getAllBookings(req: Request, res: Response, next: NextFunction) {

        try {
            let bookings = await this.bookingServices.getBookings(req.query)

            // if(!bookings || !bookings.success){
            //     return next(new AppError(bookings?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(bookings)

            // services?.success ? res.status(200).json(bookings) : res.status(400).json(bookings)

            bookings?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, bookings) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, bookings)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getAllBookings controller: ', error.message) : console.log('Unknown error from getAllBookings controller: ', error)
            // console.log('Error from getAllBookings : ', error.message);
            // res.status(500).json(error.message)
            // next(new AppError(error.message,500))
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })

        }

    }

    async deleteBooking(req: Request, res: Response, next: NextFunction) {

        try {
            let deleteBooking = await this.bookingServices.deleteBooking(req.params.id)

            // if(!deleteServices || !deleteServices.success){
            //     return next(new AppError(deleteServices?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(deleteServices) 

            // // deleteServices?.success ? res.status(200).json(deleteServices) : res.status(400).json(deleteServices)

            deleteBooking?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, deleteBooking) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, deleteBooking)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from deleteBooking controller: ', error.message) : console.log('Unknown error from deleteBooking controller: ', error)

            // console.log('Error from deleteEvent : ', error.message);
            // res.status(500).json(error.message)
            // next(new AppError(error.message,500))
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })

        }

    }

    async deleteBookedServices(req: Request, res: Response, next: NextFunction) {

        try {

            const { bookingId, serviceName, serviceId } = req.params

            let deleteBookedServices = await this.bookingServices.deleteBookedServices(bookingId, serviceName, serviceId)

            // if(!deleteServices || !deleteServices.success){
            //     return next(new AppError(deleteServices?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(deleteServices) 

            // // deleteServices?.success ? res.status(200).json(deleteServices) : res.status(400).json(deleteServices)

            deleteBookedServices?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, deleteBookedServices) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, deleteBookedServices)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from deleteBookedServices controller: ', error.message) : console.log('Unknown error from deleteBookedServices controller: ', error)

            // console.log('Error from deleteEvent : ', error.message);
            // res.status(500).json(error.message)
            // next(new AppError(error.message,500))
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })

        }

    }

    async getBookingById(req: Request, res: Response, next: NextFunction) {

        try {
            let booking = await this.bookingServices.getBookingById(req.params.id)

            // if(!services || !services.success){
            //     return next(new AppError(services?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(services) 

            // // services?.success ? res.status(200).json(services) : res.status(400).json(services)

            booking?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, booking) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, booking)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getBookingById controller: ', error.message) : console.log('Unknown error from getBookingById controller: ', error)

            // console.log('Error from getEventById : ', error.message);
            // res.status(500).json(error.message)
            // next(new AppError(error.message,500))
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })

        }

    }

    async getBookingByUserId(req: Request, res: Response, next: NextFunction) {

        try {
            let bookingsByUserId = await this.bookingServices.getBookingByUserId(req.params.id)

            // if(!bookingsByUserId || !bookingsByUserId.success){
            //     return next(new AppError(bookingsByUserId?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(bookingsByUserId) 

            bookingsByUserId?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, bookingsByUserId) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, bookingsByUserId)

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getBookingByUserId controller: ', error.message) : console.log('Unknown error from getBookingByUserId controller: ', error)

            // console.log('Error from getEventById : ', error.message);
            // res.status(500).json(error.message)
            // next(new AppError(error.message,500))
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })

        }

    }

    async editBooking(req: Request, res: Response, next: NextFunction) {

        try {
            const { id } = req.params
            // const { data } = req.body
            console.log('event details to update: ', id, req.body);

            const { name, img, services } = req.body

            const file: Express.Multer.File | undefined = req.file
            let imgNew = file ? file.filename : img
            // let choicesWithImg = JSON.parse(choices).map((choice: any, index: number) => {
            //     return {
            //         ...choice,
            //         choiceImg: files?.choiceImg ? files?.choiceImg[index].filename : choice.choiceImg
            //     }
            // })

            const newData = {
                name,
                img: imgNew,
                services: JSON.parse(services)
            }

            const newServiceResponse = await this.bookingServices.editBooking(id, newData)

            // if(!newServiceResponse || !newServiceResponse.success){
            //     return next(new AppError(newServiceResponse?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(newServiceResponse) 

            // // newServiceResponse?.success ? res.status(200).json(newServiceResponse) : res.status(400).json(newServiceResponse)

            newServiceResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, newServiceResponse) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, newServiceResponse)

        } catch (error: unknown) {

            error instanceof Error ? console.log('Error message from editBooking controller: ', error.message) : console.log('Unknown error from editBooking controller: ', error)

            // console.log('Error from edit service : ', error.message);
            // res.status(500).json(error.message)
            // next(new AppError(error.message,500))
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })

        }

    }

    async editStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.body
            // console.log('id to edit user',id);

            const newStatusResponse = await this.bookingServices.editStatus(id)
            // if(!newStatusResponse || !newStatusResponse.success){
            //     return next(new AppError(newStatusResponse?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(newStatusResponse) 

            // // newStatusResponse?.success ? res.status(200).json(newStatusResponse) : res.status(400).json(newStatusResponse)

            newStatusResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, newStatusResponse) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, newStatusResponse)

        } catch (error: unknown) {

            error instanceof Error ? console.log('Error message from editStatus controller: ', error.message) : console.log('Unknown error from editStatus controller: ', error)

            // console.log('Error from edit status : ', error.message);
            // res.status(500).json(error.message)
            // next(new AppError(error.message,500))
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })

        }
    }

    async getEventService(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, providerId } = req.params
            console.log('event name to get service', req.params.name);
            const service = await this.bookingServices.getService(name, providerId)

            // if(!service || !service.success){
            //     return next(new AppError(service?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(service) 

            // // service?.success ? res.status(200).json(service) : res.status(400).json(getServiceByName)

            service?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, service) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, service)

        } catch (error: unknown) {

            error instanceof Error ? console.log('Error message from getEventService controller: ', error.message) : console.log('Unknown error from getEventService controller: ', error)

            // console.log('Error from getEventServiceByName : ', error.message);
            // res.status(500).json(error.message)
            // next(new AppError(error.message || 'Internal server error',500))
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })

        }
    }

    async getAllEvents(req: Request, res: Response, next: NextFunction) {
        try {
            // const events = await getEventsByIdGrpc()

            const events = await this.bookingServices.getAllEvents()

            // if(!events || !events.success){
            //     return next(new AppError(events?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(events)

            events?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, events) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, events)

        } catch (error: unknown) {

            error instanceof Error ? console.log('Error message from getAllEvents controller: ', error.message) : console.log('Unknown error from getAllEvents controller: ', error)

            // console.log('Error from getEventServiceByName : ', error.message);
            // res.status(500).json(error.message)
            // next(new AppError(error.message || 'Internal server error',500))
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })

        }
    }

    async getServiceByEvent(req: Request, res: Response, next: NextFunction) {
        try {

            const { name } = req.params

            const events = await this.bookingServices.getServiceByEvent(name)

            // if(!events || !events.success){
            //     return next(new AppError(events?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(events)

            events?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, events) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, events)

        } catch (error: unknown) {

            error instanceof Error ? console.log('Error message from getServiceByEvent controller: ', error.message) : console.log('Unknown error from getServiceByEvent controller: ', error)

            // console.log('Error from getEventServiceByName : ', error.message);
            // res.status(500).json(error.message)
            // next(new AppError(error.message || 'Internal server error',500))
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })

        }
    }

    async confirmBooking(req: Request, res: Response, next: NextFunction) {
        try {
            const { bookingId } = req.body

            console.log('booking id to confirm booking:', bookingId);
            
            const confirmationResponse = await this.bookingServices.confirmBooking(bookingId)

            confirmationResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, confirmationResponse) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, confirmationResponse)

        } catch (error) {
            error instanceof Error ? console.log('Error message from getServiceByEvent controller: ', error.message) : console.log('Unknown error from getServiceByEvent controller: ', error)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })

        }
    } 

    async verifyPayment(req: Request, res: Response, next: NextFunction) {
        try {
            const { razorpay_order_id,razorpay_payment_id,razorpay_signature,bookingId } = req.body

            console.log('razorpay_order_id:', razorpay_order_id,' ,razorpay_payment_id: ',razorpay_payment_id,' ,razorpay_signature: ',razorpay_signature, ' ,bookingId: ',bookingId );
            
            const veryfyPaymentResponse = await this.bookingServices.verifyPayment(req.body)

            veryfyPaymentResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, veryfyPaymentResponse) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, veryfyPaymentResponse)

        } catch (error) {
            error instanceof Error ? console.log('Error message from getServiceByEvent controller: ', error.message) : console.log('Unknown error from getServiceByEvent controller: ', error)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })

        }
    } 

    async getSalesData(req: Request, res: Response, next: NextFunction) {

        try {
            
            const salesResponse = await this.bookingServices.getSalesData(req.query)

            salesResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, salesResponse) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, salesResponse)

        } catch (error) {
            error instanceof Error ? console.log('Error message from getServiceByEvent controller: ', error.message) : console.log('Unknown error from getServiceByEvent controller: ', error)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })

        }
    } 
    
    async getProviderSales(req: Request, res: Response, next: NextFunction) {

        try {
            
            const salesResponse = await this.bookingServices.getProviderSales(req.query)

            salesResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, salesResponse) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, salesResponse)

        } catch (error) {
            error instanceof Error ? console.log('Error message from getServiceByEvent controller: ', error.message) : console.log('Unknown error from getServiceByEvent controller: ', error)
            ResponseHandler.errorResponse(res, HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' })

        }
    } 
}

// export default new EventController()