import { NextFunction, Request, Response } from "express"
// import eventServices from "../services/eventServices";
import { CONTROLLER_RESPONSES, HttpStatusCodes, IEventController, IEventService, IEventServices } from "../interfaces/eventInterfaces";

import fs from 'fs'
import { AppError } from "../utils/appError";
import { getImgUrl } from "../utils/cloudinary";
import { ResponseHandler } from "../middlewares/responseHandler";


export class EventController implements IEventController {

    constructor(private eventServices: IEventService) { }

    async getTotalEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const eventsCount = await this.eventServices.totalEvents()
            console.log('getTotalServices controller response: ', eventsCount);

            // if(!eventsCount || !eventsCount.success){
            //     return next(new AppError(eventsCount?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(eventsCount) 

            // eventsCount?.success ? res.status(200).json(eventsCount) : res.status(400).json(eventsCount)

            // eventsCount?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, eventsCount) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, eventsCount)
            eventsCount?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, eventsCount) : next(new AppError(eventsCount))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getTotalEvents controller: ', error.message) : console.log('Unknown error from getTotalEvents controller: ', error)
            // res.status(500).json(error.message)
            // next(new AppError(error.message,500))
            // next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))
        }

    }

    async createEvent(req: Request, res: Response, next: NextFunction) {

        try {

            console.log('new event to register from frontend: ', req.body);

            console.log('new service images to register: ', req.file);
            const { name, services } = req.body
            const file: Express.Multer.File | undefined = req.file
            let imgName = file ? file.filename : ''
            let imgPath = file ? file.path : ''
            // let cloudinaryImgData = await cloudinary.uploader.upload(imgPath, { public_id: imgName,type:"authenticated",sign_url: true })
            let cloudinaryImgData = await getImgUrl(imgPath, { public_id: imgName,type:"authenticated",sign_url: true })
            let img = cloudinaryImgData.data?.imgUrl
            const eventData = {
                name,
                img,
                services: JSON.parse(services)
            }
            console.log('new service to register: ', eventData);

            const newEvent = await this.eventServices.addEvent(eventData)
            console.log('createService controller response: ', newEvent);

            // newEvent?.success ? res.status(201).json(newEvent) : res.status(400).json(newEvent)

            // if (!newEvent || !newEvent?.success) {
            //     return next(new AppError(newEvent?.message || 'Could not perform the required action. Something went wrong', 400))
            // }
            // res.status(201).json(newEvent) 

            // newEvent?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.CREATED, newEvent) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, newEvent)
            newEvent?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, newEvent) : next(new AppError(newEvent))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from createEvent controller: ', error.message) : console.log('Unknown error from createEvent controller: ', error)
            // res.status(500).json(error.message)
            // next(new AppError(error.message,500))
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))
        }

    }

    async getAllEvents(req: Request, res: Response, next: NextFunction) {

        try {
            let events = await this.eventServices.getEvents(req.query)

            // if(!events || !events.success){
            //     return next(new AppError(events?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(events)

            // events?.success ? res.status(200).json(events) : res.status(400).json(events)

            // events?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, events) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, events)
            events?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, events) : next(new AppError(events))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getAllEvents controller: ', error.message) : console.log('Unknown error from getAllEvents controller: ', error)
            // res.status(500).json(error.message)
            // next(new AppError(error.message,500))
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }

    }

    async deleteEvent(req: Request, res: Response, next: NextFunction) {

        try {
            let deleteEvent = await this.eventServices.deleteEvent(req.params.id)

            // if(!deleteEvent || !deleteEvent.success){
            //     return next(new AppError(deleteEvent?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(deleteEvent) 

            // deleteEvent?.success ? res.status(200).json(deleteEvent) : res.status(400).json(deleteEvent)

            // deleteEvent?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, deleteEvent) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, deleteEvent)
            deleteEvent?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, deleteEvent) : next(new AppError(deleteEvent))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from deleteEvent controller: ', error.message) : console.log('Unknown error from deleteEvent controller: ', error)
            // res.status(500).json(error.message)
            // next(new AppError(error.message,500))
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }

    }

    async getEventById(req: Request, res: Response, next: NextFunction) {

        try {
            let event = await this.eventServices.getEventById(req.params.id)

            // if(!event || !event.success){
            //     return next(new AppError(event?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(event) 

            // event?.success ? res.status(200).json(event) : res.status(400).json(event)

            // event?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, event) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, event)
            event?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, event) : next(new AppError(event))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getEventById controller: ', error.message) : console.log('Unknown error from getEventById controller: ', error)
            // res.status(500).json(error.message)
            // next(new AppError(error.message,500))
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }

    }

    async editEvent(req: Request, res: Response, next: NextFunction) {

        try {
            const { id } = req.params
            // const { data } = req.body
            console.log('event details to update: ', id, req.body);

            const { name, img, services } = req.body

            const file: Express.Multer.File | undefined  = req.file
            let imgName = file ? file.filename : ''
            let imgPath = file ? file.path : ''
            let cloudinaryImgData = await getImgUrl(imgPath, { public_id: imgName, type:"authenticated", sign_url: true})
            let imgNew = cloudinaryImgData.data?.imgUrl || img

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

            const updatedEvent = await this.eventServices.editEvent(id, newData)

            // if(!updatedEvent || !updatedEvent.success){
            //     return next(new AppError(updatedEvent?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(updatedEvent) 

            // updatedEvent?.success ? res.status(200).json(updatedEvent) : res.status(400).json(updatedEvent)

            // updatedEvent?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, updatedEvent) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, updatedEvent)
            updatedEvent?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, updatedEvent) : next(new AppError(updatedEvent))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from editEvent controller: ', error.message) : console.log('Unknown error from editEvent controller: ', error)
            // res.status(500).json(error.message)
            // next(new AppError(error.message,500))
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }

    }

    async editStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.body
            // console.log('id to edit user',id);

            const newStatusResponse = await this.eventServices.editStatus(id)

            // if(!newStatusResponse || !newStatusResponse.success){
            //     return next(new AppError(newStatusResponse?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(newStatusResponse) 

            // newStatusResponse?.success ? res.status(200).json(newStatusResponse) : res.status(400).json(newStatusResponse)

            // newStatusResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, newStatusResponse) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, newStatusResponse)
            newStatusResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, newStatusResponse) : next(new AppError(newStatusResponse))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from editStatus controller: ', error.message) : console.log('Unknown error from editStatus controller: ', error)
            // res.status(500).json(error.message)
            // next(new AppError(error.message,500))
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }
    }

    async getEventServiceByName(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.params
            console.log('event name to get service', req.params.name);
            const getServiceByName = await this.eventServices.getServiceByName(name)

            // if(!getServiceByName || !getServiceByName.success){
            //     return next(new AppError(getServiceByName?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(getServiceByName) 

            // getServiceByName?.success ? res.status(200).json(getServiceByName) : res.status(400).json(getServiceByName)

            // getServiceByName?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, getServiceByName) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, getServiceByName)
            getServiceByName?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, getServiceByName) : next(new AppError(getServiceByName))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getEventServiceByName controller: ', error.message) : console.log('Unknown error from getEventServiceByName controller: ', error)
            // console.log('Error from getEventServiceByName : ', error.message);
            // res.status(500).json(error.message)
            // next(new AppError(error.message || 'Internal server error',500))
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }
    }

    async getEventsByName(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.params
            console.log('event name to get all events: ', req.params.name);
            const getEventsByName = await this.eventServices.getEventsByName(name)

            // if(!getEventsByName || !getEventsByName.success){
            //     return next(new AppError(getEventsByName?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(getEventsByName)

            // getEventsByName?.success ? res.status(200).json(getEventsByName) : res.status(400).json(getServiceByName)

            // getEventsByName?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, getEventsByName) : ResponseHandler.errorResponse(res, HttpStatusCodes.BAD_REQUEST, getEventsByName)
            getEventsByName?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, getEventsByName) : next(new AppError(getEventsByName))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getEventsByName controller: ', error.message) : console.log('Unknown error from getEventsByName controller: ', error)
            // console.log('Error from getEventServiceByName : ', error.message);
            // res.status(500).json(error.message)
            // next(new AppError(error.message || 'Internal server error',500))
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }
    }

}

// export default new EventController()