import { Model, FilterQuery, UpdateQuery, Document, DeleteResult, QueryOptions } from "mongoose";
import { IRepository } from "../interfaces/eventInterfaces";


export abstract class BaseRepository<T extends Document> implements IRepository<T> {

    protected model: Model<T>

    constructor(model: Model<T>) {
        this.model = model
    }

    async createEvent(data: Partial<T>): Promise<T | null> {
        try {
            const event = new this.model(data)
            return await event.save()
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from event BaseRepository: ', error.message) : console.log('Unknown error from chat BaseRepository: ', error)
            return null
        }
    }

    async getEventById(id: string): Promise<T | null> {
        try {
            return await this.model.findById(id)
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from chat BaseRepository: ', error.message) : console.log('Unknown error from chat BaseRepository: ', error)
            return null
        }
    }

    async getAllEvents(query: FilterQuery<T> = {}, options: QueryOptions = {}): Promise<T[] | null> {
        try {
            const { sort = {}, limit = 0, skip = 0 } = options
            return await this.model.find(query).sort(sort).limit(limit).skip(skip)
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from event BaseRepository: ', error.message) : console.log('Unknown error from event BaseRepository: ', error)
            return null
        }
    }

    async updateEvent(id: string, data: UpdateQuery<T>): Promise<T | null> {
        try {
            const updateQuery: UpdateQuery<T> = {}
            if (data.$push) {
                updateQuery.$push = data.$push
            }
            if (data.$set) {
                updateQuery.$set = data.$set
            }
            // return await this.model.findOneAndUpdate({_id:id},{$set:data},{new:true})
            return await this.model.findOneAndUpdate({ _id: id }, updateQuery, { new: true })
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from event BaseRepository: ', error.message) : console.log('Unknown error from event BaseRepository: ', error)
            return null
        }
    }

    async deleteEvent(id: string): Promise<DeleteResult | null> {
        try {
            return await this.model.findByIdAndDelete(id)
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from event BaseRepository: ', error.message) : console.log('Unknown error from event BaseRepository: ', error)
            return null
        }
    }


}