import { Model, FilterQuery, UpdateQuery, Document, DeleteResult, QueryOptions } from "mongoose";
import { IRepository } from "../interfaces/chatInterfaces";

export default class BaseRepository<T extends Document> implements IRepository<T> {


    protected model: Model<T>

    constructor(model: Model<T>) {
        this.model = model
    }

    async createChat(data: Partial<T>): Promise<T | null> {
        try {
            const booking = new this.model(data)
            return await booking.save()
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from chat BaseRepository: ', error.message) : console.log('Unknown error from chat BaseRepository: ', error)
            return null
        }
    }

    async getChatById(chatId: string): Promise<T | null> {
        try {
            return await this.model.findById(chatId)
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from chat BaseRepository: ', error.message) : console.log('Unknown error from chat BaseRepository: ', error)
            return null
        }
    }

    async getAllChat(query: FilterQuery<T> = {}, options: QueryOptions = {}): Promise<T[] | null> {
        try {
            const { sort, limit, skip } = options
            return await this.model.find(query).sort(sort).limit(limit!).skip(skip!)
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from chat BaseRepository: ', error.message) : console.log('Unknown error from chat BaseRepository: ', error)
            return null
        }
    }

    async updateChat(chatId: string, data: UpdateQuery<T>): Promise<T | null> {
        try {
            const updateQuery: UpdateQuery<T> = {}
            if (data.$push) {
                updateQuery.$push = data.$push
            }
            if (data.$pull) {
                updateQuery.$pull = data.$pull
            }
            if (data.$set) {
                updateQuery.$set = data.$set
            }
            return await this.model.findOneAndUpdate({ _id: chatId }, updateQuery, { new: true })
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from chat BaseRepository: ', error.message) : console.log('Unknown error from chat BaseRepository: ', error)
            return null
        }
    }

    async deleteChat(chatId: string): Promise<DeleteResult | null> {
        try {
            return await this.model.findByIdAndDelete(chatId)
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from chat BaseRepository: ', error.message) : console.log('Unknown error from chat BaseRepository: ', error)
            return null
        }
    }


}