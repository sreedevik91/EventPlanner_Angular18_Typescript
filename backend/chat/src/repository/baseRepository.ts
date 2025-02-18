import { Model,FilterQuery,UpdateQuery, Document, DeleteResult, QueryOptions } from "mongoose";
import { IRepository } from "../interfaces/chatInterfaces";

export default class BaseRepository<T extends Document> implements IRepository<T>{

    // private model: Model<T>

    protected model: Model<T>

    constructor(model: Model<T>) {
        this.model = model
    }

    async createChat(data:Partial<T>):Promise<T>{
        const booking=new this.model(data)
        return await booking.save()
    }

    async getChatById(chatId:string):Promise<T | null>{
        return await this.model.findById(chatId)
    }

    async getAllChat(query:FilterQuery<T>={}, options:QueryOptions={}):Promise<T[]>{
        const {sort,limit,skip}=options
        return await this.model.find(query).sort(sort).limit(limit!).skip(skip!)
    }

    async updateChat(chatId:string,data:UpdateQuery<T>):Promise<T | null>{
        const updateQuery:UpdateQuery<T>={}
        if(data.$push){
            updateQuery.$push=data.$push
        }
        if(data.$pull){
            updateQuery.$pull=data.$pull
        }
        if(data.$set){
            updateQuery.$set=data.$set
        }
        return await this.model.findOneAndUpdate({_id:chatId},updateQuery,{new:true})
    }

    async deleteChat(chatId:string):Promise<DeleteResult | null>{
        return await this.model.findByIdAndDelete(chatId)
    }


}