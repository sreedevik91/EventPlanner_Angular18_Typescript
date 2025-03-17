import { Document, Model, UpdateQuery, FilterQuery, DeleteResult, QueryOptions } from "mongoose";
import { IRepository } from "../interfaces/userInterface";


export default abstract class BaseRepository<T extends Document> implements IRepository<T> {

    // private model: Model<T>

    constructor(protected model: Model<T>) {

        this.model = model
    }

    async createUser(userData: Partial<T>): Promise<T | null> {
        try {
            const user = new this.model(userData)
            return await user.save()
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from user BaseRepository: ', error.message) : console.log('Unknown error from user BaseRepository: ', error)
            return null
        }

    }

    async getUserById(userId: string): Promise<T | null> {
        try {
            // return await this.model.findOne({ _id: id })
            return await this.model.findById(userId)
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from user BaseRepository: ', error.message) : console.log('Unknown error from user BaseRepository: ', error)
            return null
        }

    }

    // async getAllUsers(query: FilterQuery<T> = {}, options: { sort?: any, limit?: number, skip?: number } = {}): Promise<T[] | null> {
    //     const { sort, limit, skip } = options
    //     return await this.model.find(query).sort(sort).limit(limit!).skip(skip!)
    // }

    async getAllUsers(query: FilterQuery<T> = {}, options: QueryOptions = {}): Promise<T[] | null> {
        try {
            const { sort, limit, skip } = options
            return await this.model.find(query).sort(sort).limit(limit!).skip(skip!)
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from user BaseRepository: ', error.message) : console.log('Unknown error from user BaseRepository: ', error)
            return null
        }

    }

    async updateUser(userId: string, data: UpdateQuery<T>): Promise<T | null> {
        try {
            return await this.model.findOneAndUpdate({ _id: userId }, { $set: data }, { new: true })
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from user BaseRepository: ', error.message) : console.log('Unknown error from user BaseRepository: ', error)
            return null
        }

    }

    async deleteUser(userId: string): Promise<DeleteResult | null> {

        try {
            return await this.model.deleteOne({ _id: userId })
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from user BaseRepository: ', error.message) : console.log('Unknown error from user BaseRepository: ', error)
            return null
        }

    }
}