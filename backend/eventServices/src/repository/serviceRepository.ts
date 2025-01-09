import { DeleteResult } from "mongoose";
import { IService, IServiceDb, IServiceRepository } from "../interfaces/serviceInterfaces";
import Service from "../models/serviceSchema";
import BaseRepository from "./baseRepository";

// class ServiceRepository implements IServiceRepository{
//     async createService(serviceData: Partial<IService>): Promise<IService> {
//         const newService= new Service(serviceData)
//         return await newService.save()
//     }
//     async deleteService(id: string): Promise<DeleteResult> {
//         return await Service.deleteOne({_id:id})
//     }
//     async getAllServices(filter:any,sort:any,limit:number,skip:number): Promise<IService[]> {
//         return await Service.find(filter).sort(sort).limit(limit).skip(skip)
//     }
//     async getServiceById(id: string): Promise<IServiceDb | null> {
//         return await Service.findOne({_id:id})
//     }
//     async getTotalServices(): Promise<number> {
//         return await Service.find().countDocuments()
//     }
//     async updateService(id:string,serviceData: Partial<IService>): Promise<IServiceDb | null> {
//         return await Service.findOneAndUpdate({_id:id},{$set:serviceData},{new:true})
//     }
// }

class ServiceRepository extends BaseRepository<IService> {

    constructor() {
        super(Service)
    }

    async getTotalServices(): Promise<number> {
        return await Service.find().countDocuments()
    }


    async getAllServiceByName(name: string):Promise<any[]> {
        return await Service.find({events:{$in:[name]}})
    }

    async getServiceByProvider(name: string,providerId:string):Promise<IService | null> {
        return await Service.findOne({name,provider:providerId})
    }

    async getAllServiceByProvider(id: string):Promise<any[]> {
        return await Service.find({provider:id})
    }


    async getServiceByName(name: string):Promise<any[]> {
        let service =await Service.aggregate([
            {$match:{name:name}}, // check with isApproved:true,isActive:true as well after testing
            {$unwind:'$choices'},
            {$project:{
                name:'$name',
                events:'$events',
                choices:'$choices',
                img:'$img'
            }},
            {$unwind:'$events'},
            {$group:{
                _id:'$choices.choiceName',
                maxPrice:{$max:'$choices.choicePrice'},
                minPrice:{$min:'$choices.choicePrice'},
                img:{$push:'$img'},
                events:{$push:'$events'},
                choicesType:{$push:'$choices.choiceType'},
                choiceImg:{$push:'$choices.choiceImg'},
                // choices:{$push:{choiceName:'$choices.choiceName',choiceType:'$choices.choiceType',choicePrice:'$choices.choicePrice',choiceImg:'$choices.choiceImg'}},

            }}

        ])

        return service
    }

}

export default new ServiceRepository()