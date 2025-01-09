import { Model,FilterQuery,UpdateQuery, Document, DeleteResult } from "mongoose";


export default class BaseRepository<T extends Document> {

    private model: Model<T>

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

    async getAllEvents(query:FilterQuery<T>={}, options:{sort?:any,limit?:number,skip?:number}){
        const {sort,limit,skip}=options
        return await this.model.find(query).sort(sort).limit(limit!).skip(skip!)
    }

    async updateEvent(id:string,data:UpdateQuery<T>):Promise<T | null>{
        return await this.model.findOneAndUpdate({_id:id},{$set:data},{new:true})
    }

    async deleteEvent(id:string):Promise<DeleteResult | null>{
        return await this.model.findByIdAndDelete(id)
    }


}