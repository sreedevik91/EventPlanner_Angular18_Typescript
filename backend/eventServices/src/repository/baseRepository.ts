import { Model, FilterQuery, UpdateQuery, Document, DeleteResult, QueryOptions } from "mongoose";
import { IRepository } from "../interfaces/serviceInterfaces";


export abstract class BaseRepository<T extends Document> implements IRepository<T> {

    protected model: Model<T>

    constructor(model: Model<T>) {
        this.model = model
    }

    async createService(data: Partial<T>): Promise<T | null> {
        try {
            const service = new this.model(data)
            return await service.save()
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from service BaseRepository: ', error.message) : console.log('Unknown error from service BaseRepository: ', error)
            return null
        }

    }

    async getServiceById(serviceId: string): Promise<T | null> {
        try {
            return await this.model.findById(serviceId)
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from service BaseRepository: ', error.message) : console.log('Unknown error from service BaseRepository: ', error)
            return null
        }

    }

    async getAllServices(query: FilterQuery<T> = {}, options: QueryOptions = {}) {
        try {
            const { sort, limit, skip } = options
            return await this.model.find(query).sort(sort).limit(limit!).skip(skip!)
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from service BaseRepository: ', error.message) : console.log('Unknown error from service BaseRepository: ', error)
            return null
        }

    }

    async updateService(serviceId: string, data: UpdateQuery<T>): Promise<T | null> {
        try {
            return await this.model.findOneAndUpdate({ _id: serviceId }, { $set: data }, { new: true })
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from service BaseRepository: ', error.message) : console.log('Unknown error from service BaseRepository: ', error)
            return null
        }

    }

    async deleteService(serviceId: string): Promise<DeleteResult | null> {
        try {
            return await this.model.findByIdAndDelete(serviceId)
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from service BaseRepository: ', error.message) : console.log('Unknown error from service BaseRepository: ', error)
            return null
        }

    }


}