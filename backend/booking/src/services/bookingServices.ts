import { IBooking, IBookedServices, IBookingDb, IEvent, IChoice, IBookingRepository, IEmailService, IBookingService, IResponse, IRequestParams, IServiceGrpcType, IServiceType } from "../interfaces/bookingInterfaces"
// import bookingRepository from "../repository/bookingRepository";
import nodemailer from 'nodemailer'
import { config } from "dotenv";
import { getServiceImgGrpc, getServicesByEventNameGrpc, getServicesByProviderAndName, getServicesByProviderGrpc } from "../grpc/grpcServiceClient";
import { getEventByNameGrpc, getEventImgGrpc, getEventsByGrpc } from "../grpc/grpcEventsClient";
import { getUserByIdGrpc } from "../grpc/grpcUserClient";
import { FilterQuery, QueryOptions } from "mongoose";

config()

export class BookingService implements IBookingService{

    constructor(
        private bookingRepository:IBookingRepository,
        private emailService:IEmailService
    ){}

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

            return bookingCount ?  { success: true, data: bookingCount }: { success: false, message: 'Could not get the total document' }

        } catch (error: unknown) {
            // console.log('Error from getTotalServices service: ', error.message);
            error instanceof Error ? console.log('Error message from getTotalServices service: ', error.message ) : console.log('Unknown error from getTotalServices service: ', error )

            return { success: false, message: 'Something went wrong' }

        }

    }

    async addBooking(bookingData: Partial<IBooking>) {

        try {

            let addBookingResponse:IResponse={success:false}

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
                    img:service[0].img,
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

                addBookingResponse = newBooking ? { success: true, data: newBooking, message:'Booking added successfully' } : { success: false, message: 'Could not create service' }

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

                addBookingResponse = newBooking ? { success: true, data: newBooking } : { success: false, message: 'Could not create service' }

            }

            return addBookingResponse

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from addBooking service: ', error.message ) : console.log('Unknown error from addBooking service: ', error )

            // console.log('Error from addBooking service: ', error.message);
            return { success: false, message: 'Something went wrong' }
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

            let bookings = await this.bookingRepository.getAllBooking(filterQ, { sort: sortQ, limit: Number(pageSize), skip })

            console.log('all service data filtered and sorted: ', bookings);

            // if (bookings) {
            //     return { success: true, data:bookings }
            // } else {
            //     return { success: false, message: 'Could not fetch data' }
            // }

            return bookings ?  { success: true, data: bookings }: { success: false, message: 'Could not fetch data' }

        } catch (error: unknown) {
            // console.log('Error from getServices: ', error.message);
            error instanceof Error ? console.log('Error message from getBookings service: ', error.message ) : console.log('Unknown error from getBookings service: ', error )

            return { success: false, message: 'Something went wrong' }
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

            return deleteBooking ? { success: true, data: deleteBooking, message: 'Event deleted successfuly' }: { success: false, message: 'Could not delete booking, Something went wrong' }

        } catch (error: unknown) {
            // console.log('Error from deleteBooking service: ', error.message);
            error instanceof Error ? console.log('Error message from deleteBooking service: ', error.message ) : console.log('Unknown error from deleteBooking service: ', error )

            return { success: false, message: 'Something went wrong' }
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
                    return { success: true, message: 'Booking deleted successfuly' }
                }
                return { success: true, data: data, message: 'Event deleted successfuly' }
            } else {
                return { success: false, message: 'Could not delete booking, Something went wrong' }
            }
        } catch (error: unknown) {
            // console.log('Error from deleteBookedServices service: ', error.message);
            error instanceof Error ? console.log('Error message from deleteBookedServices service: ', error.message ) : console.log('Unknown error from deleteBookedServices service: ', error )

            return { success: false, message: 'Something went wrong' }
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

            return booking ? { success: true, data: booking}: { success: false, message: 'Could not get booking, Something went wrong' }

        } catch (error: unknown) {
            // console.log('Error from getEventById service: ', error.message);
            error instanceof Error ? console.log('Error message from getBookingById service: ', error.message ) : console.log('Unknown error from getBookingById service: ', error )

            return { success: false, message: 'Something went wrong' }
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

            return booking ? { success: true, data: booking}: { success: false, message: 'Could not get booking, Something went wrong' }

        } catch (error: unknown) {
            // console.log('Error from getEventById service: ', error.message);
            error instanceof Error ? console.log('Error message from getBookingByUserId service: ', error.message ) : console.log('Unknown error from getBookingByUserId service: ', error )

            return { success: false, message: 'Something went wrong' }
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

            return updatedBooking ? { success: true, data: updatedBooking, message: 'Event updated successfuly' }: { success: false, message: 'Could not updated booking' }

        } catch (error: unknown) {
            // console.log('Error from updatedEvent: ', error.message);
            error instanceof Error ? console.log('Error message from editBooking service: ', error.message ) : console.log('Unknown error from editBooking service: ', error )

            return { success: false, message: 'Something went wrong' }
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

            return bookingUpdated ? { success: true, data: bookingUpdated, message: 'Event status updated' }: { success: false, message: 'Could not updated booking status' }

            } else {
                return { success: false, message: 'Could not find booking details' }
            }

        } catch (error: unknown) {
            // console.log('Error from editStatus booking: ', error.message);
            error instanceof Error ? console.log('Error message from editStatus service: ', error.message ) : console.log('Unknown error from editStatus service: ', error )

            return { success: false, message: 'Something went wrong' }
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
                return { success: false, message: 'Could not get booking service' }
            }

        } catch (error: unknown) {
            // console.log('Error from getServiceByName service: ', error, error.message);
            error instanceof Error ? console.log('Error message from getService service: ', error.message ) : console.log('Unknown error from getService service: ', error )

            return { success: false, message: 'Something went wrong' }
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
    //         return { success: false, message: 'Something went wrong' }
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
                let obj: Record<string,{eventId:string,event:string}[]> = {}
                eventsList.events.forEach((e: IEvent) => {
                    let key = e.name
                    obj[key] = obj[key] || []
                    obj[key].push({ eventId: e._id, event: e.name })
                })

                let events: { eventId: string, event: string }[] = []
                Object.values(obj).forEach((val: {eventId:string,event:string}[]) => {
                    val.forEach((eventObj: { eventId: string, event: string }) => {
                        events.push(eventObj)
                    })
                })

                console.log(`events list for grpc: `, events);
                console.log(`events array for grpc: `, eventsArray);

                return { success: true, data: events, extra: eventsArray }
            } else {
                return { success: false, message: 'Could not get booking service' }
            }

        } catch (error: unknown) {
            // console.log('Error from getServiceByName service: ', error, error.message);
            error instanceof Error ? console.log('Error message from getAllEvents service: ', error.message ) : console.log('Unknown error from getAllEvents service: ', error )

            return { success: false, message: 'Something went wrong' }
        }

    }

    async getServiceByEvent(name: string) {
        try {
            const services = await getServicesByEventNameGrpc(name)
            console.log(`services for ${name}: `, services);

            let servicesObj:{decor:IServiceType[], dining:IServiceType[], cuisine:IServiceType[], coverage:IServiceType[]}= {coverage:[],cuisine:[],decor:[],dining:[]}

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
                return { success: false, message: 'Could not get booking service' }
            }

        } catch (error: unknown) {
            // console.log('Error from getServiceByName service: ', error, error.message);
            error instanceof Error ? console.log('Error message from getServiceByEvent service: ', error.message ) : console.log('Unknown error from getServiceByEvent service: ', error )

            return { success: false, message: 'Something went wrong' }
        }

    }

}

// export default new EventServices()
