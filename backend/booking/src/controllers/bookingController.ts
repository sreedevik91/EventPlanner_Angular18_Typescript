import { NextFunction, Request, Response } from "express"
import bookingServices from "../services/bookingServices";
import { IBookedServices } from "../interfaces/bookingInterfaces";
import fs from 'fs'
import { AppError } from "../utils/appError";


class EventController {

    async getTotalBookings(req: Request, res: Response, next:NextFunction) {
        try {
            const response = await bookingServices.totalBookings()
            console.log('getTotalServices controller response: ', response);

            if(!response || !response.success){
                return next(new AppError(response?.message || 'Some error occured while processing the data', 400))
            }

            // response?.success ? res.status(200).json(response) : res.status(400).json(response)
            res.status(200).json(response) 

        } catch (error: any) {
            console.log('Error from getTotalServices controller: ', error.message);
            // res.status(500).json(error.message)
            next(new AppError(error.message,500))

        }

    }

    async createBooking(req: Request, res: Response, next: NextFunction) {

        try {

            console.log('new booking to create from frontend: ', req.body);

            const response = await bookingServices.addBooking(req.body)
            console.log('createService controller response: ', response);

            // response?.success ? res.status(200).json(response) : res.status(400).json(response)

            if (!response || !response?.success) {
                return next(new AppError(response?.message || 'Could not perform the required action. Something went wrong', 400))
            }
            res.status(200).json(response) 

        } catch (error: any) {
            console.log('Error from createService controller: ', error.message);
            // res.status(500).json(error.message)
            next(new AppError(error.message,500))
        }

    }


    async getAllBookings(req: Request, res: Response, next:NextFunction) {

        try {
            let bookings = await bookingServices.getBookings(req.query)

            if(!bookings || !bookings.success){
                return next(new AppError(bookings?.message || 'Some error occured while processing the data', 400))
            }

            // services?.success ? res.status(200).json(bookings) : res.status(400).json(bookings)
            res.status(200).json(bookings)
        } catch (error: any) {
            console.log('Error from getAllBookings : ', error.message);
            // res.status(500).json(error.message)
            next(new AppError(error.message,500))

        }

    }


    async deleteBooking(req: Request, res: Response, next:NextFunction) {

        try {
            let deleteServices = await bookingServices.deleteBooking(req.params.id)

            if(!deleteServices || !deleteServices.success){
                return next(new AppError(deleteServices?.message || 'Some error occured while processing the data', 400))
            }

            // deleteServices?.success ? res.status(200).json(deleteServices) : res.status(400).json(deleteServices)
            res.status(200).json(deleteServices) 
        } catch (error: any) {
            console.log('Error from deleteEvent : ', error.message);
            // res.status(500).json(error.message)
            next(new AppError(error.message,500))

        }

    }
 
    async deleteBookedServices(req: Request, res: Response, next:NextFunction) {

        try {

            const {bookingId,serviceName,serviceId}= req.params

            let deleteServices = await bookingServices.deleteBookedServices(bookingId,serviceName,serviceId)

            if(!deleteServices || !deleteServices.success){
                return next(new AppError(deleteServices?.message || 'Some error occured while processing the data', 400))
            }

            // deleteServices?.success ? res.status(200).json(deleteServices) : res.status(400).json(deleteServices)
            res.status(200).json(deleteServices) 
        } catch (error: any) {
            console.log('Error from deleteEvent : ', error.message);
            // res.status(500).json(error.message)
            next(new AppError(error.message,500))

        }

    }

    async getBookingById(req: Request, res: Response, next:NextFunction) {

        try {
            let services = await bookingServices.getBookingById(req.params.id)

            if(!services || !services.success){
                return next(new AppError(services?.message || 'Some error occured while processing the data', 400))
            }

            // services?.success ? res.status(200).json(services) : res.status(400).json(services)
            res.status(200).json(services) 
        } catch (error: any) {
            console.log('Error from getEventById : ', error.message);
            // res.status(500).json(error.message)
            next(new AppError(error.message,500))

        }

    }

    async getBookingByUserId(req: Request, res: Response, next:NextFunction) {

        try {
            let bookingsByUserId = await bookingServices.getBookingByUserId(req.params.id)

            if(!bookingsByUserId || !bookingsByUserId.success){
                return next(new AppError(bookingsByUserId?.message || 'Some error occured while processing the data', 400))
            }

            res.status(200).json(bookingsByUserId) 
        } catch (error: any) {
            console.log('Error from getEventById : ', error.message);
            // res.status(500).json(error.message)
            next(new AppError(error.message,500))

        }

    }


    async editBooking(req: Request, res: Response, next:NextFunction) {

        try {
            const { id } = req.params
            // const { data } = req.body
            console.log('event details to update: ', id, req.body);

            const { name, img, services} = req.body

            const file: any = req.file
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

            const newServiceResponse = await bookingServices.editBooking(id, newData)

            if(!newServiceResponse || !newServiceResponse.success){
                return next(new AppError(newServiceResponse?.message || 'Some error occured while processing the data', 400))
            }

            // newServiceResponse?.success ? res.status(200).json(newServiceResponse) : res.status(400).json(newServiceResponse)
            res.status(200).json(newServiceResponse) 
        } catch (error: any) {
            console.log('Error from edit service : ', error.message);
            // res.status(500).json(error.message)
            next(new AppError(error.message,500))

        }

    }

    async editStatus(req: Request, res: Response, next:NextFunction) {
        try {
            const { id } = req.body
            // console.log('id to edit user',id);

            const newStatusResponse = await bookingServices.editStatus(id)
            if(!newStatusResponse || !newStatusResponse.success){
                return next(new AppError(newStatusResponse?.message || 'Some error occured while processing the data', 400))
            }
            // newStatusResponse?.success ? res.status(200).json(newStatusResponse) : res.status(400).json(newStatusResponse)
            res.status(200).json(newStatusResponse) 
        } catch (error: any) {
            console.log('Error from edit status : ', error.message);
            // res.status(500).json(error.message)
            next(new AppError(error.message,500))

        }
    }

    async getEventService(req: Request, res: Response, next:NextFunction) {
        try {
            const { name , providerId} = req.params
            console.log('event name to get service', req.params.name);
            const service = await bookingServices.getService(name,providerId)

            if(!service || !service.success){
                return next(new AppError(service?.message || 'Some error occured while processing the data', 400))
            }
            // service?.success ? res.status(200).json(service) : res.status(400).json(getServiceByName)
            res.status(200).json(service) 

        } catch (error: any) {
            // console.log('Error from getEventServiceByName : ', error.message);
            // res.status(500).json(error.message)
            next(new AppError(error.message || 'Internal server error',500))
        }
    }

    async getAllEvents(req: Request, res: Response, next:NextFunction){
        try {
            // const events = await getEventsByIdGrpc()
            
            const events = await bookingServices.getAllEvents()

            if(!events || !events.success){
                return next(new AppError(events?.message || 'Some error occured while processing the data', 400))
            }

            res.status(200).json(events)

        } catch (error: any) {
            // console.log('Error from getEventServiceByName : ', error.message);
            // res.status(500).json(error.message)
            next(new AppError(error.message || 'Internal server error',500))
        }
    }
    
    async getServiceByEvent(req: Request, res: Response, next:NextFunction){
        try {

            const { name } = req.params
            
            const events = await bookingServices.getServiceByEvent(name)

            if(!events || !events.success){
                return next(new AppError(events?.message || 'Some error occured while processing the data', 400))
            }

            res.status(200).json(events)

        } catch (error: any) {
            // console.log('Error from getEventServiceByName : ', error.message);
            // res.status(500).json(error.message)
            next(new AppError(error.message || 'Internal server error',500))
        }
    }


}

export default new EventController()