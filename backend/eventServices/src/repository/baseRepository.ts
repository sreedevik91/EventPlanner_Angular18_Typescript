import { Model,FilterQuery,UpdateQuery, Document, DeleteResult } from "mongoose";


export default class BaseRepository<T extends Document> {

    private model: Model<T>

    constructor(model: Model<T>) {
        this.model = model
    }

    async createService(data:Partial<T>):Promise<T>{
        const service=new this.model(data)
        return await service.save()
    }

    async getServiceById(id:string):Promise<T | null>{
        return await this.model.findById(id)
    }

    async getAllServices(query:FilterQuery<T>={}, options:{sort?:any,limit?:number,skip?:number}){
        const {sort,limit,skip}=options
        return await this.model.find(query).sort(sort).limit(limit!).skip(skip!)
    }

    async updateService(id:string,data:UpdateQuery<T>):Promise<T | null>{
        return await this.model.findOneAndUpdate({_id:id},{$set:data},{new:true})
    }

    async deleteService(id:string):Promise<DeleteResult | null>{
        return await this.model.findByIdAndDelete(id)
    }


}