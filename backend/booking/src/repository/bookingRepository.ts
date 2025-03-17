import { DeleteResult, FilterQuery, QueryOptions } from "mongoose";
import { IBooking, IBookingRepository, IBookingsData } from "../interfaces/bookingInterfaces";
import Booking from "../models/bookingSchema";
import { BaseRepository } from "./baseRepository";
import { format } from "path";

export class BookingRepository extends BaseRepository<IBooking> implements IBookingRepository {

    constructor() {
        super(Booking)
    }

    async getTotalBookings(): Promise<number | null> {
        try {
            // return await Booking.find().countDocuments()
            return await this.model.find().countDocuments()
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from Booking BookingRepository: ', error.message) : console.log('Unknown error from Booking BookingRepository: ', error)
            return null
        }
    }

    async getBookingByUserId(id: string): Promise<IBooking[] | null> {
        try {
            // let booking =await Booking.find({userId:id})
            let booking = await this.getAllBooking({ userId: id })
            return booking
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from Booking BookingRepository: ', error.message) : console.log('Unknown error from Booking BookingRepository: ', error)
            return null
        }
    }

    async getBookingsAndCount(query: FilterQuery<IBooking> = {}, options: QueryOptions = {}): Promise<IBookingsData[] | null> {
        try {
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
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from Booking BookingRepository: ', error.message) : console.log('Unknown error from Booking BookingRepository: ', error)
            return null
        }
    }

    async getSalesData(query: FilterQuery<IBooking> = {}, options: QueryOptions = {}) {
        try {
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

                        'serviceSalesNumber': [
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
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from Booking BookingRepository: ', error.message) : console.log('Unknown error from Booking BookingRepository: ', error)
            return null
        }
    }

    async getProviderSalesData(query: FilterQuery<IBooking> = {}, options: QueryOptions = {}) {
        try {
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

                        'serviceSalesNumber': [
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
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from Booking BookingRepository: ', error.message) : console.log('Unknown error from Booking BookingRepository: ', error)
            return null
        }
    }

    async getBookingsByProvider(name: string) {
        try {
            const regexPattern = new RegExp(name, 'i')
            return await this.model.find({ isConfirmed: true, services: { $elemMatch: { providerName: { $regex: regexPattern } } }, orderDate:{$gte:new Date()} }).sort({ deliveryDate: 1 })
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from Booking BookingRepository: ', error.message) : console.log('Unknown error from Booking BookingRepository: ', error)
            return null
        }
    }

    async getTotalBookingData() {
        try {
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
                                    _id: null,
                                    totalAmount: { $sum: '$services.choicePrice' }
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    totalAmount: 1
                                }
                            }
                        ],
                        'bookingData': [
                            { $match: {} },
                            {
                                $project: {
                                    _id: 0,
                                    type: '$tag',
                                    customer: '$user',
                                    date: '$deliveryDate',
                                    isConfirmed: '$isConfirmed'
                                }
                            }
                        ],
                        'totalBooking': [
                            { $match: {} },
                            { $count: 'count' }
                        ]
                    }
                },

            ])
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from Booking BookingRepository: ', error.message) : console.log('Unknown error from Booking BookingRepository: ', error)
            return null
        }
    }

    async getAdminChartData(filter: string) {
        try {
            let dateFilter = {}

            if (filter === 'Weekly') {
                dateFilter = { $week: '$orderDate' }
            } else if (filter === 'Monthly') {
                dateFilter = { $month: '$orderDate' }
            } else if (filter === 'Yearly') {
                dateFilter = { $year: '$orderDate' }
            }

            return await this.model.aggregate([
                {
                    $facet: {
                        'servicesChartData': [
                            { $match: {isConfirmed: true } },
                            { $unwind: '$services' },
                            {
                                $group: {
                                    _id: { service: '$services.serviceName', date:dateFilter},
                                    amount:{$sum:'$services.choicePrice'}
                                }
                            }
                        ],
                        'eventsChartData': [
                            { $match: { event: { $exists: true }, isConfirmed: true } },
                            { $unwind: '$services' },
                            {
                                $group: {
                                    _id: { event: '$event', date:dateFilter},
                                    amount:{$sum:'$services.choicePrice'}
                                }
                            }
                        ],
                        // 'providerChartData': [
                        //     { $match: {isConfirmed: true } },
                        //     { $unwind: '$services' },
                        //     {
                        //         $group: {
                        //             _id: { provider: '$services.providerName', date:dateFilter},
                        //             amount:{$sum:'$services.choicePrice'}
                        //         }
                        //     }
                        // ]
                    }
                }
            ])
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from Booking BookingRepository: ', error.message) : console.log('Unknown error from Booking BookingRepository: ', error)
            return null
        }
    }

    async getProviderChartData(filter: string, name:string) {
        try {
            const regexPattern = new RegExp(name, 'i')

            let dateFilter = {}

            if (filter === 'Weekly') {
                dateFilter = { $week: '$orderDate' }
            } else if (filter === 'Monthly') {
                dateFilter = { $month: '$orderDate' }
            } else if (filter === 'Yearly') {
                dateFilter = { $year: '$orderDate' }
            }

            return await this.model.aggregate([
                {
                    $facet: {
                        'providerChartData': [
                            { $match: {isConfirmed: true, services:{$elemMatch:{providerName:{$regex:regexPattern}}} } },
                            { $unwind: '$services' },

                            {
                                $group: {
                                    _id: { provider: '$services.providerName', service: '$services.serviceName', date:dateFilter},
                                    amount:{$sum:'$services.choicePrice'}
                                }
                            }
                        ]
                    }
                }
            ])
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from Booking BookingRepository: ', error.message) : console.log('Unknown error from Booking BookingRepository: ', error)
            return null
        }
    }
}

// export default new BookingRepository()