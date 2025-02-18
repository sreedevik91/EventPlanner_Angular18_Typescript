import { Model,FilterQuery,UpdateQuery, Document, DeleteResult, QueryOptions } from "mongoose";
import { IRepository } from "../interfaces/eventInterfaces";


export abstract class BaseRepository<T extends Document> implements IRepository<T>{

    protected model: Model<T>

    constructor(model: Model<T>) {
        this.model = model
    }

    async createEvent(data:Partial<T>):Promise<T>{
        const event=new this.model(data)
        return await event.save()
    }

    async getEventById(id:string):Promise<T | null>{
        return await this.model.findById(id)
    }

    async getAllEvents(query:FilterQuery<T>={}, options:QueryOptions={}):Promise<T[]>{
        const {sort={},limit=0,skip=0}=options
        return await this.model.find(query).sort(sort).limit(limit).skip(skip)
    }

    async updateEvent(id:string,data:UpdateQuery<T>):Promise<T | null>{
        const updateQuery:UpdateQuery<T>={}
        if (data.$push){
            updateQuery.$push=data.$push
        }
        if(data.$set){
            updateQuery.$set=data.$set
        }
        // return await this.model.findOneAndUpdate({_id:id},{$set:data},{new:true})
        return await this.model.findOneAndUpdate({_id:id},updateQuery,{new:true})
    }

    async deleteEvent(id:string):Promise<DeleteResult | null>{
        return await this.model.findByIdAndDelete(id)
    }


}