import { DeleteResult } from "mongoose";
import { IEvent, IEventDb, IEventRepository } from "../interfaces/eventInterfaces";
import Event from "../models/eventSchema";
import { BaseRepository } from "./baseRepository";

// class ServiceRepository implements IServiceRepository{
//     async createService(serviceData: Partial<IService>): Promise<IService> {
//         const newService= new Event(serviceData)
//         return await newService.save()
//     }
//     async deleteService(id: string): Promise<DeleteResult> {
//         return await Event.deleteOne({_id:id})
//     }
//     async getAllServices(filter:any,sort:any,limit:number,skip:number): Promise<IService[]> {
//         return await Event.find(filter).sort(sort).limit(limit).skip(skip)
//     }
//     async getServiceById(id: string): Promise<IServiceDb | null> {
//         return await Event.findOne({_id:id})
//     }
//     async getTotalServices(): Promise<number> {
//         return await Event.find().countDocuments()
//     }
//     async updateService(id:string,serviceData: Partial<IService>): Promise<IServiceDb | null> {
//         return await Event.findOneAndUpdate({_id:id},{$set:serviceData},{new:true})
//     }
// }

export class EventRepository extends BaseRepository<IEvent> implements IEventRepository{

    constructor() {
        super(Event)
    }

    async getTotalEvents(): Promise<number> {
        // return await Event.find().countDocuments()
        return await this.model.find().countDocuments()
    }

    async getEventByName(name: string):Promise<IEventDb[]> {
        // let event =await Event.find({name})
        let event =await this.getAllEvents({name})
        // let event =await this.model.find({name})
        return event
    }

    // async getEventByName(name: string):Promise<IEvent | null> {
    //     let service =await Event.findOne({name})
    //     return service
    // }

}

// export default new EventRepository()