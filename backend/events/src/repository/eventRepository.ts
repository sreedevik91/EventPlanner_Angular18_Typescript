import { DeleteResult } from "mongoose";
import { IEvent, IEventDb, IEventRepository } from "../interfaces/eventInterfaces";
import Event from "../models/eventSchema";
import BaseRepository from "./baseRepository";

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

class EventRepository extends BaseRepository<IEvent> {

    constructor() {
        super(Event)
    }

    async getTotalEvents(): Promise<number> {
        return await Event.find().countDocuments()
    }

    // async getServiceByName(name: string):Promise<any[]> {
    //     let service =await Event.aggregate([
    //         {$match:{name:name}}, // check with isApproved:true,isActive:true as well after testing
    //         {$unwind:'$choices'},
    //         {$project:{
    //             name:'$name',
    //             events:'$events',
    //             choices:'$choices',
    //             img:'$img'
    //         }},
    //         {$unwind:'$events'},
    //         {$group:{
    //             _id:'$choices.choiceName',
    //             maxPrice:{$max:'$choices.choicePrice'},
    //             minPrice:{$min:'$choices.choicePrice'},
    //             img:{$push:'$img'},
    //             events:{$push:'$events'},
    //             choicesType:{$push:'$choices.choiceType'},
    //             choiceImg:{$push:'$choices.choiceImg'},
    //             // choices:{$push:{choiceName:'$choices.choiceName',choiceType:'$choices.choiceType',choicePrice:'$choices.choicePrice',choiceImg:'$choices.choiceImg'}},

    //         }}

    //     ])

    //     return service
    // }

}

export default new EventRepository()