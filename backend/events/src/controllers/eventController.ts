import { NextFunction, Request, Response } from "express"
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
            eventsCount?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, eventsCount) : next(new AppError(eventsCount))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getTotalEvents controller: ', error.message) : console.log('Unknown error from getTotalEvents controller: ', error)
           
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

            newEvent?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.CREATED, newEvent) : next(new AppError(newEvent))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from createEvent controller: ', error.message) : console.log('Unknown error from createEvent controller: ', error)
           
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))
        }

    }

    async getAllEvents(req: Request, res: Response, next: NextFunction) {

        try {
            let events = await this.eventServices.getEvents(req.query)

            events?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, events) : next(new AppError(events))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getAllEvents controller: ', error.message) : console.log('Unknown error from getAllEvents controller: ', error)
           
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }

    }

    async deleteEvent(req: Request, res: Response, next: NextFunction) {

        try {
            let deleteEvent = await this.eventServices.deleteEvent(req.params.id)

            deleteEvent?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, deleteEvent) : next(new AppError(deleteEvent))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from deleteEvent controller: ', error.message) : console.log('Unknown error from deleteEvent controller: ', error)
            
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }

    }

    async getEventById(req: Request, res: Response, next: NextFunction) {

        try {
            let event = await this.eventServices.getEventById(req.params.id)

            event?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, event) : next(new AppError(event))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getEventById controller: ', error.message) : console.log('Unknown error from getEventById controller: ', error)
           
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }

    }

    async editEvent(req: Request, res: Response, next: NextFunction) {

        try {
            const { id } = req.params
            console.log('event details to update: ', id, req.body);

            const { name, img, services } = req.body

            const file: Express.Multer.File | undefined  = req.file
            let imgName = file ? file.filename : ''
            let imgPath = file ? file.path : ''
            let cloudinaryImgData = await getImgUrl(imgPath, { public_id: imgName, type:"authenticated", sign_url: true})
            let imgNew = cloudinaryImgData.data?.imgUrl || img

            const newData = {
                name,
                img: imgNew,
                services: JSON.parse(services)
            }

            const updatedEvent = await this.eventServices.editEvent(id, newData)

            updatedEvent?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, updatedEvent) : next(new AppError(updatedEvent))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from editEvent controller: ', error.message) : console.log('Unknown error from editEvent controller: ', error)
           
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }

    }

    async editStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.body
           
            const newStatusResponse = await this.eventServices.editStatus(id)

            newStatusResponse?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, newStatusResponse) : next(new AppError(newStatusResponse))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from editStatus controller: ', error.message) : console.log('Unknown error from editStatus controller: ', error)
            
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }
    }

    async getEventServiceByName(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.params
            console.log('event name to get service', req.params.name);
            const getServiceByName = await this.eventServices.getServiceByName(name)

            getServiceByName?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, getServiceByName) : next(new AppError(getServiceByName))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getEventServiceByName controller: ', error.message) : console.log('Unknown error from getEventServiceByName controller: ', error)
            
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }
    }

    async getEventsByName(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.params
            console.log('event name to get all events: ', req.params.name);
            const getEventsByName = await this.eventServices.getEventsByName(name)

            getEventsByName?.success ? ResponseHandler.successResponse(res, HttpStatusCodes.OK, getEventsByName) : next(new AppError(getEventsByName))

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getEventsByName controller: ', error.message) : console.log('Unknown error from getEventsByName controller: ', error)
           
            next(new AppError({ success: false, message: CONTROLLER_RESPONSES.commonError }))

        }
    }

}
