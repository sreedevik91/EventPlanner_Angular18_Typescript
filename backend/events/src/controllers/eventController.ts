import { NextFunction, Request, Response } from "express"
import eventServices from "../services/eventServices";
import { IEventServices } from "../interfaces/eventInterfaces";

import fs from 'fs'
import { AppError } from "../utils/appError";


class EventController {

    async getTotalEvents(req: Request, res: Response, next:NextFunction) {
        try {
            const response = await eventServices.totalEvents()
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

    async createEvent(req: Request, res: Response, next: NextFunction) {

        try {

            console.log('new event to register from frontend: ', req.body);

            console.log('new service images to register: ', req.file);
            const { name, services } = req.body
            const file: any = req.file
            let img = file? file.filename : ''
           
            const data = {
                name,
                img,
                services: JSON.parse(services)
            }
            console.log('new service to register: ', data);

            const response = await eventServices.addEvent(data)
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


    async getAllEvents(req: Request, res: Response, next:NextFunction) {

        try {
            let services = await eventServices.getEvents(req.query)

            if(!services || !services.success){
                return next(new AppError(services?.message || 'Some error occured while processing the data', 400))
            }

            // services?.success ? res.status(200).json(services) : res.status(400).json(services)
            res.status(200).json(services)
        } catch (error: any) {
            console.log('Error from getAllServices : ', error.message);
            // res.status(500).json(error.message)
            next(new AppError(error.message,500))

        }

    }


    async deleteEvent(req: Request, res: Response, next:NextFunction) {

        try {
            let deleteServices = await eventServices.deleteEvent(req.params.id)

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

    async getEventById(req: Request, res: Response, next:NextFunction) {

        try {
            let services = await eventServices.getEventById(req.params.id)

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

    async editEvent(req: Request, res: Response, next:NextFunction) {

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

            const newServiceResponse = await eventServices.editEvent(id, newData)

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

            const newStatusResponse = await eventServices.editStatus(id)
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

    async getEventServiceByName(req: Request, res: Response, next:NextFunction) {
        try {
            const { name } = req.params
            console.log('event name to get service', req.params.name);
            const getServiceByName = await eventServices.getServiceByName(name)

            if(!getServiceByName || !getServiceByName.success){
                return next(new AppError(getServiceByName?.message || 'Some error occured while processing the data', 400))
            }
            // getServiceByName?.success ? res.status(200).json(getServiceByName) : res.status(400).json(getServiceByName)
            res.status(200).json(getServiceByName) 

        } catch (error: any) {
            // console.log('Error from getEventServiceByName : ', error.message);
            // res.status(500).json(error.message)
            next(new AppError(error.message || 'Internal server error',500))
        }
    }

    async getEventsByName(req: Request, res: Response, next:NextFunction){
        try {
            const { name } = req.params
            console.log('event name to get all events: ', req.params.name);
            const getEventsByName = await eventServices.getEventsByName(name)

            if(!getEventsByName || !getEventsByName.success){
                return next(new AppError(getEventsByName?.message || 'Some error occured while processing the data', 400))
            }
            // getEventsByName?.success ? res.status(200).json(getEventsByName) : res.status(400).json(getServiceByName)

            res.status(200).json(getEventsByName)

        } catch (error: any) {
            // console.log('Error from getEventServiceByName : ', error.message);
            // res.status(500).json(error.message)
            next(new AppError(error.message || 'Internal server error',500))
        }
    }

}

export default new EventController()