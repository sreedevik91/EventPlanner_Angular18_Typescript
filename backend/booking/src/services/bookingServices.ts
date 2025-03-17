import { IBooking, IBookedServices, IBookingDb, IEvent, IChoice, IBookingRepository, IEmailService, IBookingService, IResponse, IRequestParams, IServiceGrpcType, IServiceType, IPaymentService, IRazorpayResponse, IProviderBookings, IBookingAdminData, IProviderSalesData, IProviderSales, ISalesDataOut, IBookingsDataOut, SERVICE_RESPONSES, IChartDataResponseAdmin, IChartDataResponseProvider } from "../interfaces/bookingInterfaces"
// import bookingRepository from "../repository/bookingRepository";
import nodemailer from 'nodemailer'
import { config } from "dotenv";
import { getServiceImgGrpc, getServicesByEventNameGrpc, getServicesByProviderAndName, getServicesByProviderGrpc } from "../grpc/grpcServiceClient";
import { getEventByNameGrpc, getEventImgGrpc, getEventsByGrpc } from "../grpc/grpcEventsClient";
import { getUserByIdGrpc } from "../grpc/grpcUserClient";
import { FilterQuery, QueryOptions } from "mongoose";
import { log } from "@grpc/grpc-js/build/src/logging";

config()

export class BookingService implements IBookingService {

    constructor(
        private bookingRepository: IBookingRepository,
        private emailService: IEmailService,
        private paymentService: IPaymentService

    ) { }

    // async sendMail(name: string, email: string, content: string, subject: string): Promise<boolean> {

    //     return new Promise((resolve, reject) => {
    //         const transporter = nodemailer.createTransport({
    //             service: 'gmail',
    //             auth: {
    //                 user: process.env.EMAIL_USER,
    //                 pass: process.env.EMAIL_APP_PASSWORD
    //             }
    //         })

    //         let mailOptions = {
    //             from: process.env.EMAIL_USER,
    //             to: email,
    //             subject: `${subject}`,
    //             html: `
    //             <div>
    //             <p>Dear ${name}, </p>
    //             <p></p>
    //             <p>${content}</p>
    //             <p></p>
    //             <p>Warm Regards,</p>
    //             <p>Admin</p>
    //             <p>Dream Events</p>
    //             </div>
    //             `
    //         }

    //         transporter.sendMail(mailOptions, (error, info) => {
    //             // console.log(error)
    //             if (error) {
    //                 console.log(error);
    //                 resolve(false)
    //             } else {
    //                 resolve(true)
    //             }

    //         })

    //     })

    // }


    async totalBookings() {

        try {
            const bookingCount = await this.bookingRepository.getTotalBookings()
            console.log('getTotalServices service response: ', bookingCount);
            // if (bookingCount) {
            //     return { success: true, data: bookingCount }
            // } else {
            //     return { success: false, message: 'Could not get the total document' }
            // }

            return bookingCount ? { success: true, data: bookingCount } : { success: false, message: SERVICE_RESPONSES.totalBookingError }

        } catch (error: unknown) {
            // console.log('Error from getTotalServices service: ', error.message);
            error instanceof Error ? console.log('Error message from getTotalServices service: ', error.message) : console.log('Unknown error from getTotalServices service: ', error)

            return { success: false, message: SERVICE_RESPONSES.commonError }

        }

    }

    async addBooking(bookingData: Partial<IBooking>) {

        try {

            let addBookingResponse: IResponse = { success: false }

            const { user, userId, serviceId, providerId, event, style, services, deliveryDate, venue, totalCount } = bookingData

            if (serviceId && providerId && !event) {
                const serviceFromGrpc = await getServicesByProviderGrpc(providerId!)

                console.log('serviceFromGrpc for booking: ', serviceFromGrpc);

                const service = serviceFromGrpc.serviceData.filter((s: IChoice) => s.id === serviceId)

                console.log('service selected for booking: ', service);

                const provider = await getUserByIdGrpc(service[0].provider)
                // const img = await getServiceImgGrpc(service[0].img)

                services?.forEach(s => {
                    s.serviceName = service[0].name
                    // s.providerName= service[0].provider
                    s.providerName = provider.name
                })

                console.log('services array for booking after adding fields:', services);

                let bookObj = {
                    user,
                    userId,
                    service: service[0].name,
                    // img: img.imgPath,
                    img: service[0].img,
                    services,
                    deliveryDate,
                    venue,
                    tag: 'Service Booking',
                    totalCount
                }
                console.log('booking obj to create new booking:', bookObj);
                const newBooking = await this.bookingRepository.createBooking(bookObj)

                console.log('bookingData data: ', bookingData);

                console.log('bookingData service response: ', newBooking);
                // if (newBooking) {
                //     return= { success: true, data: newBooking }
                // } else {
                //     return { success: false, message: 'Could not create service' }
                // }

                addBookingResponse = newBooking ? { success: true, data: newBooking, message: SERVICE_RESPONSES.addBookingSuccess } : { success: false, message: SERVICE_RESPONSES.addBookingError }

            } else if (event) {

                const eventData = await getEventByNameGrpc(event)
                console.log('getEventByNameGrpc response: ', eventData);

                // const img = await getEventImgGrpc(eventData.event[0].img)

                for (let s of services || []) {
                    const provider = await getUserByIdGrpc(s.providerId!)
                    s.providerName = provider.name
                }

                let bookObj = {
                    user,
                    userId,
                    event,
                    img: eventData.event[0].img,
                    style,
                    services,
                    deliveryDate,
                    venue,
                    tag: 'Event Booking',
                    totalCount
                }

                const newBooking = await this.bookingRepository.createBooking(bookObj)

                console.log('bookingData data: ', bookingData);

                console.log('bookingData service response: ', newBooking);
                // if (newBooking) {
                //     return { success: true, data: newBooking }
                // } else {
                //     return { success: false, message: 'Could not create service' }
                // }

                addBookingResponse = newBooking ? { success: true, data: newBooking } : { success: false, message: SERVICE_RESPONSES.addBookingError }

            }

            return addBookingResponse

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from addBooking service: ', error.message) : console.log('Unknown error from addBooking service: ', error)

            // console.log('Error from addBooking service: ', error.message);
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async getBookings(params: IRequestParams) {

        try {
            const { userName, pageNumber, pageSize, sortBy, sortOrder } = params
            console.log('search filter params:', userName, pageNumber, pageSize, sortBy, sortOrder);
            let filterQ: FilterQuery<IBooking> = {}
            let sortQ: QueryOptions = {}
            let skip = 0
            if (userName !== undefined) {
                filterQ.user = { $regex: `.*${userName}.*`, $options: 'i' }
                // { $regex: `.*${search}.*`, $options: 'i' } 
            }

            if (sortOrder !== undefined && sortBy !== undefined) {
                let order = sortOrder === 'asc' ? 1 : -1
                if (sortBy === 'user') { sortQ.user = order }
                else if (sortBy === 'isConfirmed') { sortQ.isConfirmed = order }

            } else {
                sortQ.createdAt = 1
            }

            console.log('filterQ: ', filterQ);
            console.log('sortQ: ', sortQ);

            skip = (Number(pageNumber) - 1) * Number(pageSize)

            console.log('skip: ', skip);


            // let data = await bookingRepository.getAllServices(filterQ, sortQ, Number(pageSize), skip)

            // let bookings = await this.bookingRepository.getAllBooking(filterQ, { sort: sortQ, limit: Number(pageSize), skip })
            let bookingsData = await this.bookingRepository.getBookingsAndCount(filterQ, { sort: sortQ, limit: Number(pageSize), skip })

            let data: IBookingsDataOut = { bookings: [], count: 0 }
            if (bookingsData) {
                // console.log('all bookings data : ', bookings);
                console.log('all bookings and total count: ', bookingsData[0].bookings, bookingsData[0].bookingsCount[0].totalBookings);

                // if (bookings) {
                //     return { success: true, data:bookings }
                // } else {
                //     return { success: false, message: 'Could not fetch data' }
                // }

                data = {
                    bookings: bookingsData[0].bookings,
                    count: bookingsData[0].bookingsCount[0].totalBookings || 0
                }
            } else {
                console.log('No data available: ', bookingsData);
            }


            return bookingsData ? { success: true, data } : { success: false, message: SERVICE_RESPONSES.fetchDataError }

        } catch (error: unknown) {
            // console.log('Error from getServices: ', error.message);
            error instanceof Error ? console.log('Error message from getBookings service: ', error.message) : console.log('Unknown error from getBookings service: ', error)

            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async deleteBooking(id: string) {
        try {
            const deleteBooking = await this.bookingRepository.deleteBooking(id)

            console.log('deleteBooking service response: ', deleteBooking);
            // if (deleteBooking) {
            //     return { success: true, data: deleteBooking, message: 'Event deleted successfuly' }
            // } else {
            //     return { success: false, message: 'Could not delete booking, Something went wrong' }
            // }

            return deleteBooking ? { success: true, data: deleteBooking, message: SERVICE_RESPONSES.deleteBookingSuccess } : { success: false, message: SERVICE_RESPONSES.deleteBookingError }

        } catch (error: unknown) {
            // console.log('Error from deleteBooking service: ', error.message);
            error instanceof Error ? console.log('Error message from deleteBooking service: ', error.message) : console.log('Unknown error from deleteBooking service: ', error)

            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async deleteBookedServices(bookingId: string, serviceName: string, serviceId: string) {
        try {
            const data = await this.bookingRepository.updateBooking(bookingId, { $pull: { services: { _id: serviceId, serviceName } } })

            console.log('deleteBookedServices service response: ', data);
            if (data) {
                if (data.services.length === 0) {
                    const deleteBooking = await this.bookingRepository.deleteBooking(bookingId)
                    console.log('Booking deleted response: ', deleteBooking);
                    return { success: true, message: SERVICE_RESPONSES.deleteBookingSuccess }
                }
                return { success: true, data: data, message: SERVICE_RESPONSES.deleteServicesSuccess }
            } else {
                return { success: false, message: SERVICE_RESPONSES.deleteServicesError }
            }
        } catch (error: unknown) {
            // console.log('Error from deleteBookedServices service: ', error.message);
            error instanceof Error ? console.log('Error message from deleteBookedServices service: ', error.message) : console.log('Unknown error from deleteBookedServices service: ', error)

            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async getBookingById(id: string) {
        try {
            const booking = await this.bookingRepository.getBookingById(id)

            console.log('getEventById service response: ', booking);
            // if (booking) {
            //     return { success: true, data: booking }
            // } else {
            //     return { success: false, message: 'Could not get booking, Something went wrong' }
            // }

            return booking ? { success: true, data: booking } : { success: false, message: SERVICE_RESPONSES.getBookingError }

        } catch (error: unknown) {
            // console.log('Error from getEventById service: ', error.message);
            error instanceof Error ? console.log('Error message from getBookingById service: ', error.message) : console.log('Unknown error from getBookingById service: ', error)

            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async getBookingByUserId(id: string) {
        try {
            const booking = await this.bookingRepository.getBookingByUserId(id)

            console.log('getEventById service response: ', booking);
            // if (booking) {
            //     return { success: true, data: booking }
            // } else {
            //     return { success: false, message: 'Could not get booking, Something went wrong' }
            // }

            return booking ? { success: true, data: booking } : { success: false, message: SERVICE_RESPONSES.getBookingError }

        } catch (error: unknown) {
            // console.log('Error from getEventById service: ', error.message);
            error instanceof Error ? console.log('Error message from getBookingByUserId service: ', error.message) : console.log('Unknown error from getBookingByUserId service: ', error)

            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async getBookingsByProvider(id: string) {
        try {
            const provider = await getUserByIdGrpc(id)
            const bookings = await this.bookingRepository.getBookingsByProvider(provider.name)

            console.log('getEventById service response: ', bookings);
            // const { user, event, service, services, deliveryDate, tag, totalCount, orderDate } = booking

            let newBookings: Partial<IBooking>[] = (bookings || []).map(booking => {
                return {
                    user: booking.user,
                    event: booking.event || '',
                    service: booking.service || '',
                    deliveryDate: booking.deliveryDate,
                    venue: booking.venue,
                    tag: booking.tag,
                    totalCount: booking.totalCount,
                    orderDate: booking.orderDate,
                    services: booking.services.filter(service => service.providerName === provider?.name)
                }

            });

            console.log('filtered bookings for provider: ', newBookings);

            return bookings ? { success: true, data: newBookings } : { success: false, message: SERVICE_RESPONSES.getBookingError }

        } catch (error: unknown) {

            error instanceof Error ? console.log('Error message from getBookingByUserId service: ', error.message) : console.log('Unknown error from getBookingByUserId service: ', error)

            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async editBooking(id: string, serviceData: Partial<IBooking>) {
        try {
            const updatedBooking = await this.bookingRepository.updateBooking(id, serviceData)

            console.log('updatedEvent: ', updatedBooking);

            // if (updatedBooking) {
            //     return { success: true, data: updatedBooking, message: 'Event updated successfuly' }
            // } else {
            //     return { success: false, message: 'Could not updated booking' }
            // }

            return updatedBooking ? { success: true, data: updatedBooking, message: SERVICE_RESPONSES.editBookingSuccess } : { success: false, message: SERVICE_RESPONSES.editBookingError }

        } catch (error: unknown) {
            // console.log('Error from updatedEvent: ', error.message);
            error instanceof Error ? console.log('Error message from editBooking service: ', error.message) : console.log('Unknown error from editBooking service: ', error)

            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async editStatus(id: string) {
        // provider making the service active or block
        try {
            const booking = await this.bookingRepository.getBookingById(id)

            if (booking) {
                const bookingUpdated = await this.bookingRepository.updateBooking(id, { $set: { isConfirmed: !booking.isConfirmed } })

                console.log('editStatus service: ', booking, bookingUpdated);

                // if (bookingUpdated) {
                //     return { success: true, data: bookingUpdated, message: 'Event status updated' }
                // } else {
                //     return { success: false, message: 'Could not updated booking status' }
                // }

                return bookingUpdated ? { success: true, data: bookingUpdated, message: SERVICE_RESPONSES.editStatusSuccess } : { success: false, message: SERVICE_RESPONSES.editStatusError }

            } else {
                return { success: false, message: 'Could not find booking details' }
            }

        } catch (error: unknown) {
            // console.log('Error from editStatus booking: ', error.message);
            error instanceof Error ? console.log('Error message from editStatus service: ', error.message) : console.log('Unknown error from editStatus service: ', error)

            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async getService(name: string, providerId: string) {
        try {
            const service = await getServicesByProviderAndName(name, providerId)
            const user = await getUserByIdGrpc(providerId)
            console.log('getService response: ', service.serviceDetails);
            if (service && user) {

                service.serviceDetails.provider = user.name
                // let obj: any = {}

                // service.serviceData.forEach(async (e: any) => {

                //     obj[e.provider] = obj[e.provider] || new Set()
                //     obj[e.provider].add(e.name)

                // })

                // let servicesArray: any = []

                // for (let key in obj) {
                //     let id = key
                //     console.log('id to get user from getServiceByName: ', id);

                //     const user = await getUserByIdGrpc(id)
                //     let newObj: any = {}
                //     if (user) {
                //         newObj.provider = user.name
                //         newObj.providerId = key
                //         newObj.services = Array.from(obj[key])
                //         servicesArray.push(newObj)
                //     }

                //     obj[key]=Array.from(obj[key])
                // }

                // console.log('getServiceByName array: ', servicesArray);
                // let serviceSet = new Set()
                // service.serviceData.forEach(async (e: any) => {
                //     serviceSet.add(e.name)
                // })
                // let servicesArray = Array.from(serviceSet)
                // console.log('getServiceByName array: ', servicesArray);

                return { success: true, data: service.serviceDetails }
            } else {
                return { success: false, message: SERVICE_RESPONSES.getServiceError }
            }

        } catch (error: unknown) {
            // console.log('Error from getServiceByName service: ', error, error.message);
            error instanceof Error ? console.log('Error message from getService service: ', error.message) : console.log('Unknown error from getService service: ', error)

            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    // async getBookingsByName(name: string) {
    //     try {
    //         // const service = await getServicesByNameGrpc(name)
    //         const events: IBookingDb[] = await bookingRepository.getBookingByName(name)

    //         console.log('getServiceByName response: ', events);

    //         const services = await getServicesByEventNameGrpc(name)
    //         console.log(`Decor services for ${name}: `, services);

    //         let servicesObj: any = {}
    //         if (events && services) {
    //             services.serviceData.forEach((service: any) => {
    //                 let serviceName = service.name
    //                 if (!(serviceName in servicesObj)) {
    //                     servicesObj[serviceName] = []
    //                 }
    //                 servicesObj[serviceName].push(service)

    //             })

    //             console.log(`sorted services for ${name}: `, servicesObj);

    //             return { success: true, data: events, extra: servicesObj }
    //         } else {
    //             return { success: false, message: 'Could not get booking service' }
    //         }

    //     } catch (error: unknown) {
    //         console.log('Error from getServiceByName service: ', error, error.message);
    //         return { success: false, message: SERVICE_RESPONSES.commonError }
    //     }

    // }

    async getAllEvents() {
        try {
            // const service = await getServicesByNameGrpc(name)
            const eventsList = await getEventsByGrpc()

            console.log('getEventsByGrpc response: ', eventsList);
            if (eventsList) {

                let mySet = new Set()

                eventsList.events.forEach((event: IEvent) => {
                    mySet.add(event.name)
                })
                let eventsArray = Array.from(mySet)
                let obj: Record<string, { eventId: string, event: string }[]> = {}
                eventsList.events.forEach((e: IEvent) => {
                    let key = e.name
                    obj[key] = obj[key] || []
                    obj[key].push({ eventId: e._id, event: e.name })
                })

                let events: { eventId: string, event: string }[] = []
                Object.values(obj).forEach((val: { eventId: string, event: string }[]) => {
                    val.forEach((eventObj: { eventId: string, event: string }) => {
                        events.push(eventObj)
                    })
                })

                console.log(`events list for grpc: `, events);
                console.log(`events array for grpc: `, eventsArray);

                return { success: true, data: events, extra: eventsArray }
            } else {
                return { success: false, message: SERVICE_RESPONSES.getEventsError }
            }

        } catch (error: unknown) {
            // console.log('Error from getServiceByName service: ', error, error.message);
            error instanceof Error ? console.log('Error message from getAllEvents service: ', error.message) : console.log('Unknown error from getAllEvents service: ', error)

            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async getServiceByEvent(name: string) {
        try {
            const services = await getServicesByEventNameGrpc(name)
            console.log(`services for ${name}: `, services);

            let servicesObj: { decor: IServiceType[], dining: IServiceType[], cuisine: IServiceType[], coverage: IServiceType[] } = { coverage: [], cuisine: [], decor: [], dining: [] }

            let decor: IServiceType[] = []
            let dining: IServiceType[] = []
            let cuisine: IServiceType[] = []
            let coverage: IServiceType[] = []

            if (services) {

                services.serviceData.forEach((service: IServiceGrpcType) => {
                    // check each service options and push it to teh respective array declared above
                    service.choices.forEach((choice: IChoice) => {
                        if (service.name === 'Decor') {
                            decor.push({ service: service.name, providerId: service.provider, name: choice.choiceName, price: choice.choicePrice })
                        } else if (service.name === 'Event Coverage') {
                            coverage.push({ service: service.name, providerId: service.provider, name: choice.choiceName, price: choice.choicePrice })
                        } else if (service.name === 'Catering') {
                            if (choice.choiceName === 'Menu') {
                                cuisine.push({ service: service.name, providerId: service.provider, name: choice.choiceType, price: choice.choicePrice })
                            } else if (choice.choiceName === 'Dining') {
                                dining.push({ service: service.name, providerId: service.provider, name: choice.choiceType, price: choice.choicePrice })
                            }
                        }
                    })
                })

                console.log(`sorted services for ${name}: `, decor, dining, cuisine, coverage);
                servicesObj.decor = decor
                servicesObj.dining = dining
                servicesObj.cuisine = cuisine
                servicesObj.coverage = coverage
                console.log(`servicesObj: `, servicesObj);

                return { success: true, data: services, extra: servicesObj }
            } else {
                return { success: false, message: SERVICE_RESPONSES.getServiceError }
            }

        } catch (error: unknown) {
            // console.log('Error from getServiceByName service: ', error, error.message);
            error instanceof Error ? console.log('Error message from getServiceByEvent service: ', error.message) : console.log('Unknown error from getServiceByEvent service: ', error)

            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async confirmBooking(bookingId: string) {
        try {

            const booking = await this.bookingRepository.getBookingById(bookingId)
            const bookingService = booking?.services
            const totalAmount = bookingService?.reduce((sum: number, b: IBookedServices) => {
                sum += b.choicePrice
                return sum
            }, 0)
            console.log('booking Id for razorpay order id: ', bookingId, ' ,total amount for razorpay order id: ', totalAmount);

            const razorpayOrderId = await this.paymentService.createOrder(bookingId, totalAmount!)
            console.log('razorpay order id: ', razorpayOrderId);

            return razorpayOrderId ? { success: true, data: { razorpayOrderId, amount: totalAmount! * 100 } } : { success: false, message: SERVICE_RESPONSES.proceedPaymentError }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getServiceByEvent service: ', error.message) : console.log('Unknown error from getServiceByEvent service: ', error)

            return { success: false, message: SERVICE_RESPONSES.commonError }
        }
    }

    async verifyPayment(razorpayResponse: IRazorpayResponse) {
        try {

            const razorpayVerifyPayment = await this.paymentService.verifyOrder(razorpayResponse)

            console.log('razorpayVerifyPayment response: ', razorpayVerifyPayment);

            if (razorpayVerifyPayment) {
                const updateBooking = await this.bookingRepository.updateBooking(razorpayResponse.bookingId, { $set: { isConfirmed: true, orderDate: Date.now() } })
                console.log('updated booking after payment success: ', updateBooking);
                const userData = await getUserByIdGrpc(updateBooking?.userId!)
                let content = `
            <p>Glad to inform that your booking with Dream Events is confirmed.</p>
            <p>Please visit our website for more details. Happy events!</p>
           `
                let subject = "Booking Confirmation"
                // let provider = providerData.data
                const isSentMail = await this.emailService.sendMail(userData.name, userData.email, content, subject)
                if (!isSentMail) {
                    console.log('could not sent booking confirmation email: ', isSentMail);
                }
            }

            return razorpayVerifyPayment ? { success: true, data: {}, message: SERVICE_RESPONSES.paymentSuccess } : { success: false, message: SERVICE_RESPONSES.paymentError }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getServiceByEvent service: ', error.message) : console.log('Unknown error from getServiceByEvent service: ', error)

            return { success: false, message: SERVICE_RESPONSES.commonError }
        }
    }

    async getSalesData(params: IRequestParams) {
        try {
            console.log('entered getSalesData');

            const { pageNumberEvent, pageNumberService, pageSize, sortOrderService, sortByService, sortOrderEvent, sortByEvent, startDate, endDate, filterBy } = params
            console.log('search filter params for sales data:', pageNumberEvent, pageNumberService, pageSize, sortOrderService, sortByService, sortOrderEvent, sortByEvent, startDate, endDate, filterBy);

            let filterQEvent: FilterQuery<IBooking> = {}
            let filterQService: FilterQuery<IBooking> = {}
            let sortQEvent: QueryOptions = {}
            let sortQService: QueryOptions = {}
            let skipEvent = 0
            let skipService = 0
            let fromDate = null
            let toDate = null
            const now = new Date();

            if (sortOrderService !== undefined && sortByService !== undefined) {
                let order = sortOrderService === 'asc' ? 1 : -1
                if (sortByService === 'service') { sortQService.service = order }
                else if (sortByService === 'date') { sortQService.date = order }
                else if (sortByService === 'totalCount') { sortQService.totalCount = order }
                else if (sortByService === 'totalAmount') { sortQService.totalAmount = order }

            } else {
                sortQService.date = 1
            }

            if (sortOrderEvent !== undefined && sortByEvent !== undefined) {
                let order = sortOrderEvent === 'asc' ? 1 : -1
                if (sortByEvent === 'event') { sortQEvent.service = order }
                else if (sortByEvent === 'date') { sortQEvent.date = order }
                else if (sortByEvent === 'totalCount') { sortQEvent.totalCount = order }
                else if (sortByEvent === 'totalAmount') { sortQEvent.totalAmount = order }

            } else {
                sortQEvent.date = 1
            }

            filterQEvent.event = { $exists: true }
            filterQEvent.isConfirmed = true

            // filterQService.service = { $exists: true } // not eeded as services sre there in events as well
            filterQService.isConfirmed = true

            if (pageNumberEvent !== '' || pageNumberEvent !== undefined) {
                skipEvent = (Number(pageNumberEvent) - 1) * Number(pageSize)
            } else if (pageNumberService !== '' || pageNumberService !== undefined) {
                skipService = (Number(pageNumberService) - 1) * Number(pageSize)
            }

            if (startDate !== undefined || endDate !== undefined) {
                fromDate = new Date(startDate!)
                toDate = new Date(endDate!)
                filterQEvent.orderDate = { $gte: (fromDate), $lte: (toDate) }
                filterQService.orderDate = { $gte: (fromDate), $lte: (toDate) }
            }

            if (filterBy === '1_day') {
                fromDate = new Date(now.setDate(now.getDate() - 1))
                toDate = new Date()
                filterQEvent.orderDate = { $gte: (fromDate), $lte: (toDate) }
                filterQService.orderDate = { $gte: (fromDate), $lte: (toDate) }
            } else if (filterBy === '1_week') {
                fromDate = new Date(now.setDate(now.getDate() - 7))
                toDate = new Date()
                filterQEvent.orderDate = { $gte: (fromDate), $lte: (toDate) }
                filterQService.orderDate = { $gte: (fromDate), $lte: (toDate) }
            } else if (filterBy === '1_month') {
                fromDate = new Date(now.setMonth(now.getMonth() - 1))
                toDate = new Date()
                filterQEvent.orderDate = { $gte: (fromDate), $lte: (toDate) }
                filterQService.orderDate = { $gte: (fromDate), $lte: (toDate) }
            }

            // filterQEvent.createdAt = fromDate && toDate ? { $gte: (fromDate), $lte: (toDate) } : {}
            // filterQService.createdAt = fromDate && toDate ? { $gte: (fromDate), $lte: (toDate) } : {}

            console.log('filterQService: ', filterQService, ', filterQEvent: ', filterQEvent);
            console.log('sortQEvent: ', sortQEvent, ',sortQService: ', sortQService);
            console.log('skipService: ', skipService, ', skipEvent: ', skipEvent);

            const salesData = await this.bookingRepository.getSalesData({ filterQEvent, filterQService }, { sortQEvent, sortQService, limit: Number(pageSize), skipEvent, skipService })

            let data: ISalesDataOut = { eventSales: [], eventSalesCount: 0, serviceSalesCount: 0, servicesSales: [] }
            if (salesData) {
                console.log('salesData: ', salesData, ', eventSales response: ', salesData[0].eventsData, ', serviceSales response: ', salesData[0].serviceData, ', eventSalesCount response: ', salesData[0].eventSalesCount, ', serviceSalesCount response: ', salesData[0].serviceSalesNumber);
                data = {
                    eventSales: salesData[0].eventsData,
                    eventSalesCount: salesData[0].eventSalesCount[0]?.totalSale || 0,
                    servicesSales: salesData[0].serviceData,
                    serviceSalesCount: salesData[0].serviceSalesNumber[0]?.totalSale || 0,
                }
            } else {

                console.log('No data available: ', salesData);

            }

            return salesData ? { success: true, data } : { success: false, message: SERVICE_RESPONSES.fetchDataError }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getServiceByEvent service: ', error.message) : console.log('Unknown error from getServiceByEvent service: ', error)

            return { success: false, message: SERVICE_RESPONSES.commonError }
        }
    }

    async getProviderSales(params: IRequestParams) {
        try {
            console.log('entered getProviderSales');

            const { pageNumberService, pageSize, sortOrderService, sortByService, startDate, endDate, filterBy, providerId } = params
            console.log('search filter params for provider sales data:', pageNumberService, pageSize, sortOrderService, sortByService, startDate, endDate, filterBy, providerId);

            const providerData = await getUserByIdGrpc(providerId!)
            let provider = providerData.name
            console.log('provider details to get sales data: ', providerData);

            let filterQService: FilterQuery<IBooking> = {}
            let sortQService: QueryOptions = {}
            let skipService = 0
            let fromDate = null
            let toDate = null
            const now = new Date();

            if (sortOrderService !== undefined && sortByService !== undefined) {
                let order = sortOrderService === 'asc' ? 1 : -1
                if (sortByService === 'service') { sortQService.service = order }
                else if (sortByService === 'date') { sortQService.date = order }
                else if (sortByService === 'totalCount') { sortQService.totalCount = order }
                else if (sortByService === 'totalAmount') { sortQService.totalAmount = order }

            } else {
                sortQService.date = 1
            }

            // filterQService.service = { $exists: true } // not eeded as services sre there in events as well
            const regexPattern = new RegExp(provider, 'i')
            filterQService.isConfirmed = true
            filterQService.services = {
                $elemMatch: {
                    providerName: { $regex: regexPattern }
                }
            }

            if (pageNumberService !== '' || pageNumberService !== undefined) {
                skipService = (Number(pageNumberService) - 1) * Number(pageSize)
            }

            if (startDate !== undefined || endDate !== undefined) {
                fromDate = new Date(startDate!)
                toDate = new Date(endDate!)
                filterQService.orderDate = { $gte: (fromDate), $lte: (toDate) }
            }

            if (filterBy === '1_day') {
                fromDate = new Date(now.setDate(now.getDate() - 1))
                toDate = new Date()
                filterQService.orderDate = { $gte: (fromDate), $lte: (toDate) }
            } else if (filterBy === '1_week') {
                fromDate = new Date(now.setDate(now.getDate() - 7))
                toDate = new Date()
                filterQService.orderDate = { $gte: (fromDate), $lte: (toDate) }
            } else if (filterBy === '1_month') {
                fromDate = new Date(now.setMonth(now.getMonth() - 1))
                toDate = new Date()
                filterQService.orderDate = { $gte: (fromDate), $lte: (toDate) }
            }

            // filterQService.createdAt = fromDate && toDate ? { $gte: (fromDate), $lte: (toDate) } : {}

            console.log('filterQService: ', filterQService);
            console.log('sortQService: ', sortQService);
            console.log('skipService: ', skipService);

            const salesData = await this.bookingRepository.getProviderSalesData(filterQService, { sortQService, limit: Number(pageSize), skipService })

            let data: IProviderSales = { servicesSales: [], serviceSalesCount: 0 }
            if (salesData) {
                console.log('salesData: ', salesData, ', serviceSales response: ', salesData[0].serviceData, ', serviceSalesCount response: ', salesData[0].serviceSalesNumber);

                data = {
                    servicesSales: salesData[0].serviceData,
                    serviceSalesCount: salesData[0].serviceSalesNumber[0]?.totalSale || 0,
                }
            } else {
                console.log('No data available: ', salesData);
            }

            return salesData ? { success: true, data } : { success: false, message: SERVICE_RESPONSES.fetchDataError }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getServiceByEvent service: ', error.message) : console.log('Unknown error from getServiceByEvent service: ', error)

            return { success: false, message: SERVICE_RESPONSES.commonError }
        }
    }

    async getAdminBookingData() {
        try {

            const adminData = await this.bookingRepository.getTotalBookingData()

            let data: IBookingAdminData = { bookingData: [], oldBookings: 0, totalBooking: 0, totalRevenue: 0, upcomingBookings: 0 }
            if (adminData) {
                console.log('adminData: ', adminData,
                    ', bookingData response: ', adminData[0].bookingData,
                    ', oldBookings count response: ', adminData[0].oldBookings[0],
                    ', totalRevenue amount response: ', adminData[0].totalRevenue[0]?.totalAmount,
                    ', upcomingBookings count response: ', adminData[0].upcomingBookings[0],
                    ', totalBooking count response: ', adminData[0].totalBooking[0],
                );
                data = {
                    bookingData: adminData[0].bookingData,
                    oldBookings: adminData[0].oldBookings[0]?.count || 0,
                    upcomingBookings: adminData[0].upcomingBookings[0]?.count || 0,
                    totalRevenue: adminData[0].totalRevenue[0]?.totalAmount || 0,
                    totalBooking: adminData[0].totalBooking[0]?.count || 0
                }

            } else {
                console.log('No data available: ', adminData);
            }
            return adminData ? { success: true, data } : { success: false, message: SERVICE_RESPONSES.fetchDataError }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getAdminBookingData service: ', error.message) : console.log('Unknown error from getAdminBookingData service: ', error)

            return { success: false, message: SERVICE_RESPONSES.commonError }
        }
    }

    async getAdminChartData(filter: string) {
        try {

            const chartData = await this.bookingRepository.getAdminChartData(filter)

            // console.log('charts data:', chartData);

            let data: IChartDataResponseAdmin = { servicesChartData: { label: [], amount: [] }, eventsChartData: { label: [], amount: [] } }
            // let data:IChartDataResponse= { servicesChartData: { label: [], amount:[]}, eventsChartData:{ label: [], amount:[]},providerChartData:{ label: [], amount:[]}}

            if (chartData) {
                console.log('chartData: ', chartData,
                    ', servicesChartData response: ', chartData[0].servicesChartData,
                    ', eventsChartData count response: ', chartData[0].eventsChartData,
                    // ', providerChartData amount response: ', chartData[0].providerChartData
                );
                data = {
                    servicesChartData: { label: chartData[0].servicesChartData.map(e => e._id.service), amount: chartData[0].servicesChartData.map(e => e.amount) },
                    eventsChartData: { label: chartData[0].eventsChartData.map(e => e._id.event), amount: chartData[0].eventsChartData.map(e => e.amount) },
                    // providerChartData: {label:chartData[0].providerChartData.map(e=>e._id.provider),amount:chartData[0].providerChartData.map(e=>e.amount)}
                }
                console.log('charts data response:', data);

            } else {
                console.log('No data available: ', chartData);
            }
            return chartData ? { success: true, data } : { success: false, message: SERVICE_RESPONSES.fetchDataError }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getAdminBookingData service: ', error.message) : console.log('Unknown error from getAdminBookingData service: ', error)

            return { success: false, message: SERVICE_RESPONSES.commonError }
        }
    }

    async getProviderChartData(filter: string, name: string) {
        try {

            const chartData = await this.bookingRepository.getProviderChartData(filter, name)

            // console.log('charts data:', chartData);

            let data: IChartDataResponseProvider = { providerChartData: { label: [], amount: []} }

            if (chartData) {
                console.log('chartData: ', chartData,
                    ', providerChartData amount response: ', chartData[0].providerChartData
                );
                data = {
                    providerChartData: { label: chartData[0].providerChartData.map(e => e._id.service), amount: chartData[0].providerChartData.map(e => e.amount) }
                }
                console.log('charts data response:', data);

            } else {
                console.log('No data available: ', chartData);
            }
            return chartData ? { success: true, data } : { success: false, message: SERVICE_RESPONSES.fetchDataError }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getAdminBookingData service: ', error.message) : console.log('Unknown error from getAdminBookingData service: ', error)

            return { success: false, message: SERVICE_RESPONSES.commonError }
        }
    }

}


// export default new EventServices()
