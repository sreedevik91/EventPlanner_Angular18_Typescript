import { Document, Model, UpdateQuery, FilterQuery, DeleteResult } from "mongoose";


export default class BaseRepository<T extends Document> {

    private model: Model<T>

    constructor(model: Model<T>) {
        this.model = model
    }

    async createUser(data: Partial<T>): Promise<T> {
        const user = new this.model(data)
        return await user.save()
    }

    async getUserById(id: string): Promise<T | null> {
        // return await this.model.findOne({ _id: id })
        return await this.model.findById(id)
    }

    async getAllUsers(query: FilterQuery<T> = {}, options: { sort?: any, limit?: number, skip?: number } = {}): Promise<T[] | null> {
        const { sort, limit, skip } = options
        return await this.model.find(query).sort(sort).limit(limit!).skip(skip!)
    }

    async updateUser(id: string, data: UpdateQuery<T>): Promise<T | null> {
        return await this.model.findOneAndUpdate({ _id: id }, { $set: data }, { new: true })
    }

    async deleteUser(id: string): Promise<DeleteResult> {
        return await this.model.deleteOne({ _id: id })
    }
}