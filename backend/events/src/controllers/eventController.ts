import { NextFunction, Request, Response } from "express"
// import eventServices from "../services/eventServices";
import { HttpStatusCodes, IEventController, IEventService, IEventServices } from "../interfaces/eventInterfaces";

import fs from 'fs'
import { AppError } from "../utils/appError";
import cloudinary from "../utils/cloudinary";
import { ResponseHandler } from "../middlewares/responseHandler";


export class EventController implements IEventController{

    constructor(private eventServices:IEventService){}

    async getTotalEvents(req: Request, res: Response, next:NextFunction) {
        try {
            const eventsCount = await this.eventServices.totalEvents()
            console.log('getTotalServices controller response: ', eventsCount);

            // if(!eventsCount || !eventsCount.success){
            //     return next(new AppError(eventsCount?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(eventsCount) 

            // eventsCount?.success ? res.status(200).json(eventsCount) : res.status(400).json(eventsCount)

            eventsCount?.success ? ResponseHandler.successResponse(res,HttpStatusCodes.OK,eventsCount) : ResponseHandler.errorResponse(res,HttpStatusCodes.BAD_REQUEST,eventsCount)


        } catch (error: any) {
            console.log('Error from getTotalServices controller: ', error.message);
            // res.status(500).json(error.message)
            // next(new AppError(error.message,500))
            ResponseHandler.errorResponse(res,HttpStatusCodes.INTERNAL_SERVER_ERROR,{success:false, message:'Something went wrong.'})

        }

    }

    async createEvent(req: Request, res: Response, next: NextFunction) {

        try {

            console.log('new event to register from frontend: ', req.body);

            console.log('new service images to register: ', req.file);
            const { name, services } = req.body
            const file: any = req.file
            let imgName = file? file.filename : ''
            let imgPath = file ? file.path : ''
            let cloudinaryImgData = await cloudinary.uploader.upload(imgPath, { public_id: imgName })
            let img = cloudinaryImgData.url
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

            newEvent?.success ? ResponseHandler.successResponse(res,HttpStatusCodes.CREATED,newEvent) : ResponseHandler.errorResponse(res,HttpStatusCodes.BAD_REQUEST,newEvent)

        } catch (error: any) {
            console.log('Error from createService controller: ', error.message);
            // res.status(500).json(error.message)
            // next(new AppError(error.message,500))
            ResponseHandler.errorResponse(res,HttpStatusCodes.INTERNAL_SERVER_ERROR,{success:false, message:'Something went wrong.'})
        }

    }

    async getAllEvents(req: Request, res: Response, next:NextFunction) {

        try {
            let events = await this.eventServices.getEvents(req.query)

            // if(!events || !events.success){
            //     return next(new AppError(events?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(events)

            // events?.success ? res.status(200).json(events) : res.status(400).json(events)

            events?.success ? ResponseHandler.successResponse(res,HttpStatusCodes.OK,events) : ResponseHandler.errorResponse(res,HttpStatusCodes.BAD_REQUEST,events)


        } catch (error: any) {
            console.log('Error from getAllServices : ', error.message);
            // res.status(500).json(error.message)
            // next(new AppError(error.message,500))
            ResponseHandler.errorResponse(res,HttpStatusCodes.INTERNAL_SERVER_ERROR,{success:false, message:'Something went wrong.'})

        }

    }

    async deleteEvent(req: Request, res: Response, next:NextFunction) {

        try {
            let deleteEvent = await this.eventServices.deleteEvent(req.params.id)

            // if(!deleteEvent || !deleteEvent.success){
            //     return next(new AppError(deleteEvent?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(deleteEvent) 

            // deleteEvent?.success ? res.status(200).json(deleteEvent) : res.status(400).json(deleteEvent)

            deleteEvent?.success ? ResponseHandler.successResponse(res,HttpStatusCodes.OK,deleteEvent) : ResponseHandler.errorResponse(res,HttpStatusCodes.BAD_REQUEST,deleteEvent)
            
        } catch (error: any) {
            console.log('Error from deleteEvent : ', error.message);
            // res.status(500).json(error.message)
            // next(new AppError(error.message,500))
            ResponseHandler.errorResponse(res,HttpStatusCodes.INTERNAL_SERVER_ERROR,{success:false, message:'Something went wrong.'})

        }

    }

    async getEventById(req: Request, res: Response, next:NextFunction) {

        try {
            let event = await this.eventServices.getEventById(req.params.id)

            // if(!event || !event.success){
            //     return next(new AppError(event?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(event) 

            // event?.success ? res.status(200).json(event) : res.status(400).json(event)

            event?.success ? ResponseHandler.successResponse(res,HttpStatusCodes.OK,event) : ResponseHandler.errorResponse(res,HttpStatusCodes.BAD_REQUEST,event)

            
        } catch (error: any) {
            console.log('Error from getEventById : ', error.message);
            // res.status(500).json(error.message)
            // next(new AppError(error.message,500))
            ResponseHandler.errorResponse(res,HttpStatusCodes.INTERNAL_SERVER_ERROR,{success:false, message:'Something went wrong.'})

        }

    }

    async editEvent(req: Request, res: Response, next:NextFunction) {

        try {
            const { id } = req.params
            // const { data } = req.body
            console.log('event details to update: ', id, req.body);

            const { name, img, services} = req.body

            const file: any = req.file
            let imgName = file? file.filename : ''
            let imgPath = file ? file.path : ''
            let cloudinaryImgData = await cloudinary.uploader.upload(imgPath, { public_id: imgName })
            let imgNew = cloudinaryImgData.url ||  img
            
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

            updatedEvent?.success ? ResponseHandler.successResponse(res,HttpStatusCodes.OK,updatedEvent) : ResponseHandler.errorResponse(res,HttpStatusCodes.BAD_REQUEST,updatedEvent)

        } catch (error: any) {
            console.log('Error from edit service : ', error.message);
            // res.status(500).json(error.message)
            // next(new AppError(error.message,500))
            ResponseHandler.errorResponse(res,HttpStatusCodes.INTERNAL_SERVER_ERROR,{success:false, message:'Something went wrong.'})

        }

    }

    async editStatus(req: Request, res: Response, next:NextFunction) {
        try {
            const { id } = req.body
            // console.log('id to edit user',id);

            const newStatusResponse = await this.eventServices.editStatus(id)

            // if(!newStatusResponse || !newStatusResponse.success){
            //     return next(new AppError(newStatusResponse?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(newStatusResponse) 
            
            // newStatusResponse?.success ? res.status(200).json(newStatusResponse) : res.status(400).json(newStatusResponse)
           
            newStatusResponse?.success ? ResponseHandler.successResponse(res,HttpStatusCodes.OK,newStatusResponse) : ResponseHandler.errorResponse(res,HttpStatusCodes.BAD_REQUEST,newStatusResponse)

        } catch (error: any) {
            console.log('Error from edit status : ', error.message);
            // res.status(500).json(error.message)
            // next(new AppError(error.message,500))
            ResponseHandler.errorResponse(res,HttpStatusCodes.INTERNAL_SERVER_ERROR,{success:false, message:'Something went wrong.'})

        }
    }

    async getEventServiceByName(req: Request, res: Response, next:NextFunction) {
        try {
            const { name } = req.params
            console.log('event name to get service', req.params.name);
            const getServiceByName = await this.eventServices.getServiceByName(name)

            // if(!getServiceByName || !getServiceByName.success){
            //     return next(new AppError(getServiceByName?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(getServiceByName) 

            // getServiceByName?.success ? res.status(200).json(getServiceByName) : res.status(400).json(getServiceByName)

            getServiceByName?.success ? ResponseHandler.successResponse(res,HttpStatusCodes.OK,getServiceByName) : ResponseHandler.errorResponse(res,HttpStatusCodes.BAD_REQUEST,getServiceByName)


        } catch (error: any) {
            // console.log('Error from getEventServiceByName : ', error.message);
            // res.status(500).json(error.message)
            // next(new AppError(error.message || 'Internal server error',500))
            ResponseHandler.errorResponse(res,HttpStatusCodes.INTERNAL_SERVER_ERROR,{success:false, message:'Something went wrong.'})

        }
    }

    async getEventsByName(req: Request, res: Response, next:NextFunction){
        try {
            const { name } = req.params
            console.log('event name to get all events: ', req.params.name);
            const getEventsByName = await this.eventServices.getEventsByName(name)

            // if(!getEventsByName || !getEventsByName.success){
            //     return next(new AppError(getEventsByName?.message || 'Some error occured while processing the data', 400))
            // }
            // res.status(200).json(getEventsByName)

            // getEventsByName?.success ? res.status(200).json(getEventsByName) : res.status(400).json(getServiceByName)

            getEventsByName?.success ? ResponseHandler.successResponse(res,HttpStatusCodes.OK,getEventsByName) : ResponseHandler.errorResponse(res,HttpStatusCodes.BAD_REQUEST,getEventsByName)


        } catch (error: any) {
            // console.log('Error from getEventServiceByName : ', error.message);
            // res.status(500).json(error.message)
            next(new AppError(error.message || 'Internal server error',500))
            ResponseHandler.errorResponse(res,HttpStatusCodes.INTERNAL_SERVER_ERROR,{success:false, message:'Something went wrong.'})

        }
    }

}

// export default new EventController()