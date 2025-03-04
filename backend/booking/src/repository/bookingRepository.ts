import { DeleteResult, FilterQuery, QueryOptions } from "mongoose";
import { IBooking, IBookingRepository, IBookingsData } from "../interfaces/bookingInterfaces";
import Booking from "../models/bookingSchema";
import { BaseRepository } from "./baseRepository";
import { format } from "path";

export class BookingRepository extends BaseRepository<IBooking> implements IBookingRepository {

    constructor() {
        super(Booking)
    }

    async getTotalBookings(): Promise<number> {
        // return await Booking.find().countDocuments()
        return await this.model.find().countDocuments()
    }

    async getBookingByUserId(id: string): Promise<IBooking[]> {
        // let booking =await Booking.find({userId:id})
        let booking = await this.getAllBooking({ userId: id })
        return booking
    }

    async getBookingsAndCount(query: FilterQuery<IBooking> = {}, options: QueryOptions = {}): Promise<IBookingsData[]> {
        const { sort, limit, skip } = options
        return await this.model.aggregate([
            {
                $facet: {
                    'bookings': [
                        { $match: query },
                        { $sort: sort },
                        { $skip: skip! },
                        { $limit: limit! }
                    ],
                    'bookingsCount': [
                        { $match: query },
                        { $count: 'totalBookings' }
                    ]
                }
            }
        ])
    }

    async getSalesData(query: FilterQuery<IBooking> = {}, options: QueryOptions = {}) {

        const { sortQEvent, sortQService, limit, skipEvent, skipService } = options
        const { filterQEvent, filterQService } = query
        console.log('getSalesData filter queries: ', filterQEvent, filterQService);

        const salesData = await this.model.aggregate([
            {
                $facet: {
                    'eventsData': [
                        // { $match: { event: { $exists: true }, isConfirmed: true } },
                        { $match: filterQEvent },
                        {
                            $addFields: {
                                totalServiceAmount: { $sum: '$services.choicePrice' }
                            }
                        },
                        {
                            $group: {
                                _id: { event: '$event', date: { $dateToString: { format: '%d-%m-%Y', date: '$orderDate' } } },
                                totalAmount: { $sum: '$totalServiceAmount' },
                                totalCount: { $sum: 1 }
                            }
                        },
                        {
                            $project: {
                                event: '$_id.event',
                                date: '$_id.date',
                                totalAmount: 1,
                                totalCount: 1,
                                _id: 0
                            }
                        },
                        { $sort: sortQEvent },
                        { $skip: skipEvent },            // Skip for pagination (e.g., page 1: skip 0)
                        { $limit: limit! },          // Limit results per page

                    ],
                    'eventSalesCount': [
                        { $match: filterQEvent },
                        {
                            $group: {
                                _id: { event: '$event', date: { $dateToString: { format: '%d-%m-%Y', date: '$orderDate' } } },
                                // totalAmount: { $sum: '$services.choicePrice' },
                                // totalCount: { $sum: 1 }
                            }
                        },
                        { $count: 'totalSale' }
                    ],
                    'serviceData': [
                        // { $match: { service: { $exists: true }, isConfirmed: true } },
                        { $match: filterQService },
                        { $unwind: '$services' },
                        {
                            $group: {
                                _id: { service: '$services.serviceName', date: { $dateToString: { format: '%d-%m-%Y', date: '$orderDate' } } },
                                totalAmount: { $sum: '$services.choicePrice' },
                                totalCount: { $sum: 1 }
                            }
                        },
                        {
                            $project: {
                                service: '$_id.service',
                                date: '$_id.date',
                                totalAmount: 1,
                                totalCount: 1,
                                _id: 0
                            }
                        },
                        { $sort: sortQService },
                        { $skip: skipService },            // Skip for pagination (e.g., page 1: skip 0)
                        { $limit: limit! },          // Limit results per page
                    ],

                    'serviceSalesCount': [
                        { $match: filterQService },
                        { $unwind: '$services' },
                        {
                            $group: {
                                _id: { service: '$services.serviceName', date: { $dateToString: { format: '%d-%m-%Y', date: '$orderDate' } } },
                                // totalAmount: { $sum: '$services.choicePrice' },
                                // totalCount: { $sum: 1 }
                            }
                        },
                        { $count: 'totalSale' }
                    ]

                }
            }

        ])

        return salesData
    }

    async getProviderSalesData(query: FilterQuery<IBooking> = {}, options: QueryOptions = {}) {

        const { sortQService, limit, skipService } = options
        console.log('getProviderSalesData query: ', query);

        const salesData = await this.model.aggregate([
            {
                $facet: {

                    'serviceData': [
                        // { $match: { service: { $exists: true }, isConfirmed: true } },
                        { $match: query },
                        { $unwind: '$services' },
                        {
                            $group: {
                                _id: { service: '$services.serviceName', date: { $dateToString: { format: '%d-%m-%Y', date: '$orderDate' } } },
                                totalAmount: { $sum: '$services.choicePrice' },
                                totalCount: { $sum: 1 }
                            }
                        },
                        {
                            $project: {
                                service: '$_id.service',
                                date: '$_id.date',
                                totalAmount: 1,
                                totalCount: 1,
                                _id: 0
                            }
                        },
                        { $sort: sortQService },
                        { $skip: skipService },            // Skip for pagination (e.g., page 1: skip 0)
                        { $limit: limit! },          // Limit results per page
                    ],

                    'serviceSalesCount': [
                        { $match: query },
                        { $unwind: '$services' },
                        {
                            $group: {
                                _id: { service: '$services.serviceName', date: { $dateToString: { format: '%d-%m-%Y', date: '$orderDate' } } },
                                totalAmount: { $sum: '$services.choicePrice' },
                                totalCount: { $sum: 1 }
                            }
                        },
                        { $count: 'totalSale' }
                    ]


                }
            }

        ])

        return salesData
    }

    async getBookingsByProvider(name: string) {
        const regexPattern = new RegExp(name, 'i')
        return await this.model.find({ isConfirmed: true, services: { $elemMatch: { providerName: { $regex: regexPattern } } } }).sort({ deliveryDate: 1 })
    }

    async getTotalBookingData() {
        return await this.model.aggregate([
            {
                $facet: {
                    'oldBookings': [
                        { $match: { deliveryDate: { $lte: new Date() }, isConfirmed: true } },
                        { $count: 'count' }
                    ],
                    'upcomingBookings': [
                        { $match: { deliveryDate: { $gt: new Date() }, isConfirmed: true } },
                        { $count: 'count' }
                    ],
                    'totalRevenue': [
                        { $match: {} },
                        { $unwind: '$services' },
                        {
                            $group: {
                                _id:null,
                                totalAmount: {$sum: '$services.choicePrice' }
                            }
                        },
                        {
                            $project: {
                                _id:0,
                                totalAmount: 1
                            }
                        }
                    ],
                    'bookingData': [
                        { $match: {} },
                        {
                            $project: {
                                _id:0,
                                type: '$tag',
                                customer: '$user',
                                date: '$deliveryDate',
                                isConfirmed: '$isConfirmed'
                            }
                        }
                    ],
                    'totalBooking':[
                        { $match: {} },
                        {$count:'count'}
                    ]
                }
            },

        ])
    }
}

// export default new BookingRepository()