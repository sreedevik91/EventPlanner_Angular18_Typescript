import { DeleteResult } from "mongoose";
import { IService, IServiceDb, IServiceRepository } from "../interfaces/serviceInterfaces";
import Service from "../models/serviceSchema";

class ServiceRepository implements IServiceRepository{
    async createService(serviceData: Partial<IService>): Promise<IService> {
        const newService= new Service(serviceData)
        return await newService.save()
    }
    async deleteService(id: string): Promise<DeleteResult> {
        return await Service.deleteOne({_id:id})
    }
    async getAllServices(filter:any,sort:any,limit:number,skip:number): Promise<IService[]> {
        return await Service.find(filter).sort(sort).limit(limit).skip(skip)
    }
    async getServiceById(id: string): Promise<IServiceDb | null> {
        return await Service.findOne({_id:id})
    }
    async getTotalServices(): Promise<number> {
        return await Service.find().countDocuments()
    }
    async updateService(id:string,serviceData: Partial<IService>): Promise<IServiceDb | null> {
        return await Service.findOneAndUpdate({_id:id},{$set:serviceData},{new:true})
    }
}

export default new ServiceRepository()