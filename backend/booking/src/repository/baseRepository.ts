import { Model,FilterQuery,UpdateQuery, Document, DeleteResult, QueryOptions } from "mongoose";
import { IRepository } from "../interfaces/bookingInterfaces";


export abstract class BaseRepository<T extends Document> implements IRepository<T>{

    private model: Model<T>

    constructor(model: Model<T>) {
        this.model = model
    }

    async createBooking(bookingData:Partial<T>):Promise<T>{
        const booking=new this.model(bookingData)
        return await booking.save()
    }

    async getBookingById(bookingId:string):Promise<T | null>{
        return await this.model.findById(bookingId)
    }

    async getAllBooking(query:FilterQuery<T>={}, options:QueryOptions={}):Promise<T[]>{
        const {sort,limit,skip}=options
        return await this.model.find(query).sort(sort).limit(limit!).skip(skip!)
    }

    async updateBooking(bookingId:string,data:UpdateQuery<T>):Promise<T | null>{
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
        return await this.model.findOneAndUpdate({_id:bookingId},updateQuery,{new:true})
    }

    async deleteBooking(bookingId:string):Promise<DeleteResult | null>{
        return await this.model.findByIdAndDelete(bookingId)
    }


}