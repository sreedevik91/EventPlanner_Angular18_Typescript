import { Model,FilterQuery,UpdateQuery, Document, DeleteResult, QueryOptions } from "mongoose";
import { IRepository } from "../interfaces/serviceInterfaces";


export abstract class BaseRepository<T extends Document> implements IRepository<T> {

    private model: Model<T>

    constructor(model: Model<T>) {
        this.model = model
    }

    async createService(data:Partial<T>):Promise<T>{
        const service=new this.model(data)
        return await service.save()
    }

    async getServiceById(serviceId:string):Promise<T | null>{
        return await this.model.findById(serviceId)
    }

    async getAllServices(query:FilterQuery<T>={}, options: QueryOptions= {}){
        const {sort,limit,skip}=options
        return await this.model.find(query).sort(sort).limit(limit!).skip(skip!)
    }

    async updateService(serviceId:string,data:UpdateQuery<T>):Promise<T | null>{
        return await this.model.findOneAndUpdate({_id:serviceId},{$set:data},{new:true})
    }

    async deleteService(serviceId:string):Promise<DeleteResult | null>{
        return await this.model.findByIdAndDelete(serviceId)
    }


}