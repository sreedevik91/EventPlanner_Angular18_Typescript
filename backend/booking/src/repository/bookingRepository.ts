import { DeleteResult } from "mongoose";
import { IBooking} from "../interfaces/bookingInterfaces";
import Booking from "../models/bookingSchema";
import BaseRepository from "./baseRepository";

class BookingRepository extends BaseRepository<IBooking> {

    constructor() {
        super(Booking)
    }

    async getTotalBookings(): Promise<number> {
        return await Booking.find().countDocuments()
    }

    async getBookingByUserId(id: string):Promise<any[]> {
        let booking =await Booking.find({userId:id})
        return booking
    } 

}

export default new BookingRepository()