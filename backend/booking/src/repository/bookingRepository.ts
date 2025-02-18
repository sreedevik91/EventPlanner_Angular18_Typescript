import { DeleteResult } from "mongoose";
import { IBooking, IBookingRepository} from "../interfaces/bookingInterfaces";
import Booking from "../models/bookingSchema";
import { BaseRepository } from "./baseRepository";

export class BookingRepository extends BaseRepository<IBooking> implements IBookingRepository{

    constructor() {
        super(Booking)
    }

    async getTotalBookings(): Promise<number> {
        // return await Booking.find().countDocuments()
        return await this.model.find().countDocuments()
    }

    async getBookingByUserId(id: string):Promise<IBooking[]> {
        // let booking =await Booking.find({userId:id})
        let booking =await this.getAllBooking({userId:id})
        return booking
    } 

}

// export default new BookingRepository()