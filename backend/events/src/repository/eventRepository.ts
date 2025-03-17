import { DeleteResult, FilterQuery, QueryOptions } from "mongoose";
import { IEvent, IEventDb, IEventRepository, IEventsData } from "../interfaces/eventInterfaces";
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

export class EventRepository extends BaseRepository<IEvent> implements IEventRepository {

    constructor() {
        super(Event)
    }

    async getTotalEvents(): Promise<number | null> {
        try {
            // return await Event.find().countDocuments()
            return await this.model.find().countDocuments()
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from event EventRepository: ', error.message) : console.log('Unknown error from chat EventRepository: ', error)
            return null
        }
    }

    async getEventByName(name: string): Promise<IEventDb[] | null> {
        try {
            // let event =await Event.find({name})
            let event = await this.getAllEvents({ name })
            // let event =await this.model.find({name})
            return event
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from event EventRepository: ', error.message) : console.log('Unknown error from chat EventRepository: ', error)
            return null
        }
    }

    async getEventsAndCount(query: FilterQuery<IEvent> = {}, options: QueryOptions = {}): Promise<IEventsData[] | null> {
        try {
            const { sort = {}, limit = 0, skip = 0 } = options
            return await this.model.aggregate([
                {
                    $facet: {
                        'events': [
                            { $match: query },
                            { $sort: sort },
                            { $skip: skip! },
                            { $limit: limit! }
                        ],
                        'eventsCount': [
                            { $match: query },
                            { $count: 'totalEvents' }
                        ]
                    }
                }
            ])
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from event EventRepository: ', error.message) : console.log('Unknown error from chat EventRepository: ', error)
            return null
        }
    }

    // async getEventByName(name: string):Promise<IEvent | null> {
    //     let service =await Event.findOne({name})
    //     return service
    // }

}

// export default new EventRepository()