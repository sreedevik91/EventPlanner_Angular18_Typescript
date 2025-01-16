import { Model,FilterQuery,UpdateQuery, Document, DeleteResult } from "mongoose";


export default class BaseRepository<T extends Document> {

    private model: Model<T>

    constructor(model: Model<T>) {
        this.model = model
    }

    async createBooking(data:Partial<T>):Promise<T>{
        const booking=new this.model(data)
        return await booking.save()
    }

    async getBookingById(id:string):Promise<T | null>{
        return await this.model.findById(id)
    }

    async getAllBooking(query:FilterQuery<T>={}, options:{sort?:any,limit?:number,skip?:number}){
        const {sort,limit,skip}=options
        return await this.model.find(query).sort(sort).limit(limit!).skip(skip!)
    }

    async updateBooking(id:string,data:UpdateQuery<T>):Promise<T | null>{
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

    async deleteBooking(id:string):Promise<DeleteResult | null>{
        return await this.model.findByIdAndDelete(id)
    }


}