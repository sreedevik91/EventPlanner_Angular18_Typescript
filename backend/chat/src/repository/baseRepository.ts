import { Model,FilterQuery,UpdateQuery, Document, DeleteResult } from "mongoose";


export default class BaseRepository<T extends Document> {

    private model: Model<T>

    constructor(model: Model<T>) {
        this.model = model
    }

    async createChat(data:Partial<T>):Promise<T>{
        const booking=new this.model(data)
        return await booking.save()
    }

    async getChatById(id:string):Promise<T | null>{
        return await this.model.findById(id)
    }

    async getAllChat(query:FilterQuery<T>={}, options:{sort?:any,limit?:number,skip?:number}){
        const {sort,limit,skip}=options
        return await this.model.find(query).sort(sort).limit(limit!).skip(skip!)
    }

    async updateChat(id:string,data:UpdateQuery<T>):Promise<T | null>{
        const updateQuery:any={}
        if(data.$push){
            updateQuery.$push=data.$push
        }
        if(data.$pull){
            updateQuery.$pull=data.$pull
        }
        if(data.$set){
            updateQuery.$set=data.$set
        }
        return await this.model.findOneAndUpdate({_id:id},updateQuery,{new:true})
    }

    async deleteChat(id:string):Promise<DeleteResult | null>{
        return await this.model.findByIdAndDelete(id)
    }


}