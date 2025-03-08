"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
// import eventServices from "../services/eventServices";
const eventInterfaces_1 = require("../interfaces/eventInterfaces");
const cloudinary_1 = require("../utils/cloudinary");
const responseHandler_1 = require("../middlewares/responseHandler");
class EventController {
    constructor(eventServices) {
        this.eventServices = eventServices;
    }
    getTotalEvents(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eventsCount = yield this.eventServices.totalEvents();
                console.log('getTotalServices controller response: ', eventsCount);
                // if(!eventsCount || !eventsCount.success){
                //     return next(new AppError(eventsCount?.message || 'Some error occured while processing the data', 400))
                // }
                // res.status(200).json(eventsCount) 
                // eventsCount?.success ? res.status(200).json(eventsCount) : res.status(400).json(eventsCount)
                (eventsCount === null || eventsCount === void 0 ? void 0 : eventsCount.success) ? responseHandler_1.ResponseHandler.successResponse(res, eventInterfaces_1.HttpStatusCodes.OK, eventsCount) : responseHandler_1.ResponseHandler.errorResponse(res, eventInterfaces_1.HttpStatusCodes.BAD_REQUEST, eventsCount);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from getTotalEvents controller: ', error.message) : console.log('Unknown error from getTotalEvents controller: ', error);
                // res.status(500).json(error.message)
                // next(new AppError(error.message,500))
                responseHandler_1.ResponseHandler.errorResponse(res, eventInterfaces_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' });
            }
        });
    }
    createEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log('new event to register from frontend: ', req.body);
                console.log('new service images to register: ', req.file);
                const { name, services } = req.body;
                const file = req.file;
                let imgName = file ? file.filename : '';
                let imgPath = file ? file.path : '';
                // let cloudinaryImgData = await cloudinary.uploader.upload(imgPath, { public_id: imgName,type:"authenticated",sign_url: true })
                let cloudinaryImgData = yield (0, cloudinary_1.getImgUrl)(imgPath, { public_id: imgName, type: "authenticated", sign_url: true });
                let img = (_a = cloudinaryImgData.data) === null || _a === void 0 ? void 0 : _a.imgUrl;
                const eventData = {
                    name,
                    img,
                    services: JSON.parse(services)
                };
                console.log('new service to register: ', eventData);
                const newEvent = yield this.eventServices.addEvent(eventData);
                console.log('createService controller response: ', newEvent);
                // newEvent?.success ? res.status(201).json(newEvent) : res.status(400).json(newEvent)
                // if (!newEvent || !newEvent?.success) {
                //     return next(new AppError(newEvent?.message || 'Could not perform the required action. Something went wrong', 400))
                // }
                // res.status(201).json(newEvent) 
                (newEvent === null || newEvent === void 0 ? void 0 : newEvent.success) ? responseHandler_1.ResponseHandler.successResponse(res, eventInterfaces_1.HttpStatusCodes.CREATED, newEvent) : responseHandler_1.ResponseHandler.errorResponse(res, eventInterfaces_1.HttpStatusCodes.BAD_REQUEST, newEvent);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from createEvent controller: ', error.message) : console.log('Unknown error from createEvent controller: ', error);
                // res.status(500).json(error.message)
                // next(new AppError(error.message,500))
                responseHandler_1.ResponseHandler.errorResponse(res, eventInterfaces_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' });
            }
        });
    }
    getAllEvents(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let events = yield this.eventServices.getEvents(req.query);
                // if(!events || !events.success){
                //     return next(new AppError(events?.message || 'Some error occured while processing the data', 400))
                // }
                // res.status(200).json(events)
                // events?.success ? res.status(200).json(events) : res.status(400).json(events)
                (events === null || events === void 0 ? void 0 : events.success) ? responseHandler_1.ResponseHandler.successResponse(res, eventInterfaces_1.HttpStatusCodes.OK, events) : responseHandler_1.ResponseHandler.errorResponse(res, eventInterfaces_1.HttpStatusCodes.BAD_REQUEST, events);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from getAllEvents controller: ', error.message) : console.log('Unknown error from getAllEvents controller: ', error);
                // res.status(500).json(error.message)
                // next(new AppError(error.message,500))
                responseHandler_1.ResponseHandler.errorResponse(res, eventInterfaces_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' });
            }
        });
    }
    deleteEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let deleteEvent = yield this.eventServices.deleteEvent(req.params.id);
                // if(!deleteEvent || !deleteEvent.success){
                //     return next(new AppError(deleteEvent?.message || 'Some error occured while processing the data', 400))
                // }
                // res.status(200).json(deleteEvent) 
                // deleteEvent?.success ? res.status(200).json(deleteEvent) : res.status(400).json(deleteEvent)
                (deleteEvent === null || deleteEvent === void 0 ? void 0 : deleteEvent.success) ? responseHandler_1.ResponseHandler.successResponse(res, eventInterfaces_1.HttpStatusCodes.OK, deleteEvent) : responseHandler_1.ResponseHandler.errorResponse(res, eventInterfaces_1.HttpStatusCodes.BAD_REQUEST, deleteEvent);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from deleteEvent controller: ', error.message) : console.log('Unknown error from deleteEvent controller: ', error);
                // res.status(500).json(error.message)
                // next(new AppError(error.message,500))
                responseHandler_1.ResponseHandler.errorResponse(res, eventInterfaces_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' });
            }
        });
    }
    getEventById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let event = yield this.eventServices.getEventById(req.params.id);
                // if(!event || !event.success){
                //     return next(new AppError(event?.message || 'Some error occured while processing the data', 400))
                // }
                // res.status(200).json(event) 
                // event?.success ? res.status(200).json(event) : res.status(400).json(event)
                (event === null || event === void 0 ? void 0 : event.success) ? responseHandler_1.ResponseHandler.successResponse(res, eventInterfaces_1.HttpStatusCodes.OK, event) : responseHandler_1.ResponseHandler.errorResponse(res, eventInterfaces_1.HttpStatusCodes.BAD_REQUEST, event);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from getEventById controller: ', error.message) : console.log('Unknown error from getEventById controller: ', error);
                // res.status(500).json(error.message)
                // next(new AppError(error.message,500))
                responseHandler_1.ResponseHandler.errorResponse(res, eventInterfaces_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' });
            }
        });
    }
    editEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { id } = req.params;
                // const { data } = req.body
                console.log('event details to update: ', id, req.body);
                const { name, img, services } = req.body;
                const file = req.file;
                let imgName = file ? file.filename : '';
                let imgPath = file ? file.path : '';
                let cloudinaryImgData = yield (0, cloudinary_1.getImgUrl)(imgPath, { public_id: imgName, type: "authenticated", sign_url: true });
                let imgNew = ((_a = cloudinaryImgData.data) === null || _a === void 0 ? void 0 : _a.imgUrl) || img;
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
                };
                const updatedEvent = yield this.eventServices.editEvent(id, newData);
                // if(!updatedEvent || !updatedEvent.success){
                //     return next(new AppError(updatedEvent?.message || 'Some error occured while processing the data', 400))
                // }
                // res.status(200).json(updatedEvent) 
                // updatedEvent?.success ? res.status(200).json(updatedEvent) : res.status(400).json(updatedEvent)
                (updatedEvent === null || updatedEvent === void 0 ? void 0 : updatedEvent.success) ? responseHandler_1.ResponseHandler.successResponse(res, eventInterfaces_1.HttpStatusCodes.OK, updatedEvent) : responseHandler_1.ResponseHandler.errorResponse(res, eventInterfaces_1.HttpStatusCodes.BAD_REQUEST, updatedEvent);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from editEvent controller: ', error.message) : console.log('Unknown error from editEvent controller: ', error);
                // res.status(500).json(error.message)
                // next(new AppError(error.message,500))
                responseHandler_1.ResponseHandler.errorResponse(res, eventInterfaces_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' });
            }
        });
    }
    editStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                // console.log('id to edit user',id);
                const newStatusResponse = yield this.eventServices.editStatus(id);
                // if(!newStatusResponse || !newStatusResponse.success){
                //     return next(new AppError(newStatusResponse?.message || 'Some error occured while processing the data', 400))
                // }
                // res.status(200).json(newStatusResponse) 
                // newStatusResponse?.success ? res.status(200).json(newStatusResponse) : res.status(400).json(newStatusResponse)
                (newStatusResponse === null || newStatusResponse === void 0 ? void 0 : newStatusResponse.success) ? responseHandler_1.ResponseHandler.successResponse(res, eventInterfaces_1.HttpStatusCodes.OK, newStatusResponse) : responseHandler_1.ResponseHandler.errorResponse(res, eventInterfaces_1.HttpStatusCodes.BAD_REQUEST, newStatusResponse);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from editStatus controller: ', error.message) : console.log('Unknown error from editStatus controller: ', error);
                // res.status(500).json(error.message)
                // next(new AppError(error.message,500))
                responseHandler_1.ResponseHandler.errorResponse(res, eventInterfaces_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' });
            }
        });
    }
    getEventServiceByName(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.params;
                console.log('event name to get service', req.params.name);
                const getServiceByName = yield this.eventServices.getServiceByName(name);
                // if(!getServiceByName || !getServiceByName.success){
                //     return next(new AppError(getServiceByName?.message || 'Some error occured while processing the data', 400))
                // }
                // res.status(200).json(getServiceByName) 
                // getServiceByName?.success ? res.status(200).json(getServiceByName) : res.status(400).json(getServiceByName)
                (getServiceByName === null || getServiceByName === void 0 ? void 0 : getServiceByName.success) ? responseHandler_1.ResponseHandler.successResponse(res, eventInterfaces_1.HttpStatusCodes.OK, getServiceByName) : responseHandler_1.ResponseHandler.errorResponse(res, eventInterfaces_1.HttpStatusCodes.BAD_REQUEST, getServiceByName);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from getEventServiceByName controller: ', error.message) : console.log('Unknown error from getEventServiceByName controller: ', error);
                // console.log('Error from getEventServiceByName : ', error.message);
                // res.status(500).json(error.message)
                // next(new AppError(error.message || 'Internal server error',500))
                responseHandler_1.ResponseHandler.errorResponse(res, eventInterfaces_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' });
            }
        });
    }
    getEventsByName(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.params;
                console.log('event name to get all events: ', req.params.name);
                const getEventsByName = yield this.eventServices.getEventsByName(name);
                // if(!getEventsByName || !getEventsByName.success){
                //     return next(new AppError(getEventsByName?.message || 'Some error occured while processing the data', 400))
                // }
                // res.status(200).json(getEventsByName)
                // getEventsByName?.success ? res.status(200).json(getEventsByName) : res.status(400).json(getServiceByName)
                (getEventsByName === null || getEventsByName === void 0 ? void 0 : getEventsByName.success) ? responseHandler_1.ResponseHandler.successResponse(res, eventInterfaces_1.HttpStatusCodes.OK, getEventsByName) : responseHandler_1.ResponseHandler.errorResponse(res, eventInterfaces_1.HttpStatusCodes.BAD_REQUEST, getEventsByName);
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from getEventsByName controller: ', error.message) : console.log('Unknown error from getEventsByName controller: ', error);
                // console.log('Error from getEventServiceByName : ', error.message);
                // res.status(500).json(error.message)
                // next(new AppError(error.message || 'Internal server error',500))
                responseHandler_1.ResponseHandler.errorResponse(res, eventInterfaces_1.HttpStatusCodes.INTERNAL_SERVER_ERROR, { success: false, message: 'Something went wrong.' });
            }
        });
    }
}
exports.EventController = EventController;
// export default new EventController()
