import { IBooking, IBookedServices, IBookingDb } from "../interfaces/bookingInterfaces"
import bookingRepository from "../repository/bookingRepository";
import nodemailer from 'nodemailer'
import { config } from "dotenv";
import { getServicesByEventNameGrpc, getServicesByProviderAndName, getServicesByProviderGrpc } from "../grpc/grpcServiceClient";
import { getUserByIdGrpc } from "../grpc/grpcUserClient";

config()

class EventServices {


    async sendMail(name: string, email: string, content: string, subject: string): Promise<boolean> {

        return new Promise((resolve, reject) => {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_APP_PASSWORD
                }
            })

            let mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: `${subject}`,
                html: `
                <div>
                <p>Dear ${name}, </p>
                <p></p>
                <p>${content}</p>
                <p></p>
                <p>Warm Regards,</p>
                <p>Admin</p>
                <p>Dream Events</p>
                </div>
                `
            }

            transporter.sendMail(mailOptions, (error, info) => {
                // console.log(error)
                if (error) {
                    console.log(error);
                    resolve(false)
                } else {
                    resolve(true)
                }

            })

        })

    }


    async totalBookings() {

        try {
            const data = await bookingRepository.getTotalBookings()
            console.log('getTotalServices service response: ', data);
            if (data) {
                return { success: true, data: data }
            } else {
                return { success: false, message: 'Could not get the total document' }
            }
        } catch (error: any) {
            console.log('Error from getTotalServices service: ', error.message);
        }

    }

    async addBooking(bookingData: Partial<IBooking>) {

        try {

            // user: '',
            // service: '',
            //     event: '',
            //             services: [serviceName:string;
            //                        providerName:string;
            //                        serviceChoiceName:string;
            //                        serviceChoiceAmount:string;],
            //                 deliveryDate: ,
            // venue:,
            //     tag:,
            // totalCount: ,

            const { user, serviceId, providerId, eventId, services, deliveryDate, venue, totalCount } = bookingData

            const serviceData = await getServicesByProviderGrpc(providerId!)

            const service = serviceData.filter((s: any) => s._id === serviceId)

            console.log('service selected for booking: ', service);

            const serviceObj = {
                serviceName: service.name,
                providerName: '',
                serviceChoiceName: '',
                serviceChoiceAmount: ''
            }

            const data = await bookingRepository.createBooking(bookingData)

            console.log('bookingData data: ', bookingData);

            console.log('bookingData service response: ', data);
            if (data) {
                return { success: true, data: data }
            } else {
                return { success: false, message: 'Could not create service' }
            }
        } catch (error: any) {
            console.log('Error from addService service: ', error.message);
        }

    }

    async getBookings(params: any) {

        try {
            const { eventName, isActive, pageNumber, pageSize, sortBy, sortOrder } = params
            console.log('search filter params:', eventName, isActive, pageNumber, pageSize, sortBy, sortOrder);
            let filterQ: any = {}
            let sortQ: any = {}
            let skip = 0
            if (eventName !== undefined) {
                filterQ.name = { $regex: `.*${eventName}.*`, $options: 'i' }
                // { $regex: `.*${search}.*`, $options: 'i' } 
            }

            if (sortOrder !== undefined && sortBy !== undefined) {
                let order = sortOrder === 'asc' ? 1 : -1
                if (sortBy === 'name') { sortQ.name = order }
                else if (sortBy === 'events') { sortQ.events = order }
                else if (sortBy === 'isApproved') { sortQ.isApproved = order }
                else if (sortBy === 'provider') { sortQ.provider = order }
                else if (sortBy === 'isActive') { sortQ.isActive = order }
            } else {
                sortQ.createdAt = 1
            }

            console.log('filterQ: ', filterQ);
            console.log('sortQ: ', sortQ);

            skip = (Number(pageNumber) - 1) * Number(pageSize)

            console.log('skip: ', skip);


            // let data = await bookingRepository.getAllServices(filterQ, sortQ, Number(pageSize), skip)

            let data = await bookingRepository.getAllBooking(filterQ, { sort: sortQ, limit: Number(pageSize), skip })

            console.log('all service data filtered and sorted: ', data);

            if (data) {
                return { success: true, data }
            } else {
                return { success: false, message: 'Could not fetch data' }
            }
        } catch (error: any) {
            console.log('Error from getServices: ', error.message);
        }

    }


    async deleteBooking(id: string) {
        try {
            const data = await bookingRepository.deleteBooking(id)

            console.log('deleteEvent service response: ', data);
            if (data) {
                return { success: true, data: data, message: 'Event deleted successfuly' }
            } else {
                return { success: false, message: 'Could not delete booking, Something went wrong' }
            }
        } catch (error: any) {
            console.log('Error from deleteEvent service: ', error.message);
        }

    }

    async getBookingById(id: string) {
        try {
            const data = await bookingRepository.getBookingById(id)

            console.log('getEventById service response: ', data);
            if (data) {
                return { success: true, data: data }
            } else {
                return { success: false, message: 'Could not get booking, Something went wrong' }
            }
        } catch (error: any) {
            console.log('Error from getEventById service: ', error.message);
        }

    }

    async editBooking(id: string, serviceData: Partial<IBooking>) {
        try {
            const updatedEvent = await bookingRepository.updateBooking(id, serviceData)

            console.log('updatedEvent: ', updatedEvent);

            if (updatedEvent) {
                return { success: true, data: updatedEvent, message: 'Event updated successfuly' }
            } else {
                return { success: false, message: 'Could not updated booking' }
            }
        } catch (error: any) {
            console.log('Error from updatedEvent: ', error.message);
        }

    }

    async editStatus(id: string) {
        // provider making the service active or block
        try {
            const booking = await bookingRepository.getBookingById(id)

            if (booking) {
                const eventUpdated = await bookingRepository.updateBooking(id, { isConfirmed: !booking.isConfirmed })

                console.log('editStatus service: ', booking, eventUpdated);

                if (eventUpdated) {
                    return { success: true, data: eventUpdated, message: 'Event status updated' }
                } else {
                    return { success: false, message: 'Could not updated booking status' }
                }
            } else {
                return { success: false, message: 'Could not find booking details' }
            }

        } catch (error: any) {
            console.log('Error from editStatus booking: ', error.message);
        }

    }

    async getService(name: string, providerId:string) {
        try {
            const service = await getServicesByProviderAndName(name,providerId)
            const user= await getUserByIdGrpc(providerId)
            console.log('getService response: ', service.serviceDetails);
            if (service && user) {

                service.serviceDetails.provider=user.name
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

                return { success: true, data: service.serviceDetails}
            } else {
                return { success: false, message: 'Could not get booking service' }
            }

        } catch (error: any) {
            console.log('Error from getServiceByName service: ', error, error.message);
        }

    }

    async getBookingsByName(name: string) {
        try {
            // const service = await getServicesByNameGrpc(name)
            const events: IBookingDb[] = await bookingRepository.getBookingByName(name)

            console.log('getServiceByName response: ', events);

            const services = await getServicesByEventNameGrpc(name)
            console.log(`Decor services for ${name}: `, services);

            let servicesObj: any = {}
            if (events && services) {
                services.serviceData.forEach((service: any) => {
                    let serviceName = service.name
                    if (!(serviceName in servicesObj)) {
                        servicesObj[serviceName] = []
                    }
                    servicesObj[serviceName].push(service)

                })

                console.log(`sorted services for ${name}: `, servicesObj);

                return { success: true, data: events, extra: servicesObj }
            } else {
                return { success: false, message: 'Could not get booking service' }
            }

        } catch (error: any) {
            console.log('Error from getServiceByName service: ', error, error.message);
        }

    }



}

export default new EventServices()
