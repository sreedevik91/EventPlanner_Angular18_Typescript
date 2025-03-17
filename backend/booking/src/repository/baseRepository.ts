import { Model, FilterQuery, UpdateQuery, Document, DeleteResult, QueryOptions } from "mongoose";
import { IRepository } from "../interfaces/bookingInterfaces";


export abstract class BaseRepository<T extends Document> implements IRepository<T> {

    protected model: Model<T> // 'protected' will make this property available for the child classes, if private is used it would be available only for this class

    constructor(model: Model<T>) {
        this.model = model
    }

    async createBooking(bookingData: Partial<T>): Promise<T | null> {
        try {
            const booking = new this.model(bookingData)
            return await booking.save()
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from Booking BaseRepository: ', error.message) : console.log('Unknown error from Booking BaseRepository: ', error)
            // throw new Error("Failed to create user");
            return null
        }

    }

    async getBookingById(bookingId: string): Promise<T | null> {
        try {
            return await this.model.findById(bookingId)
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from Booking BaseRepository: ', error.message) : console.log('Unknown error from Booking BaseRepository: ', error)
            // throw new Error("Failed to create user");
            return null
        }
    }

    async getAllBooking(query: FilterQuery<T> = {}, options: QueryOptions = {}): Promise<T[] | null> {
        try {
            const { sort, limit, skip } = options
            return await this.model.find(query).sort(sort).limit(limit!).skip(skip!)
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from Booking BaseRepository: ', error.message) : console.log('Unknown error from Booking BaseRepository: ', error)
            return null
        }
    }

    async updateBooking(bookingId: string, data: UpdateQuery<T>): Promise<T | null> {
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
            return await this.model.findOneAndUpdate({ _id: bookingId }, updateQuery, { new: true })
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from Booking BaseRepository: ', error.message) : console.log('Unknown error from Booking BaseRepository: ', error)
            return null
        }
    }

    async deleteBooking(bookingId: string): Promise<DeleteResult | null> {
        try {
            return await this.model.findByIdAndDelete(bookingId)
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from Booking BaseRepository: ', error.message) : console.log('Unknown error from Booking BaseRepository: ', error)
            return null
        }
    }


}