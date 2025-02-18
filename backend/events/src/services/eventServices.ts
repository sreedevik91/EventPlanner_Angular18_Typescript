import { IEvent, IEventServices, IEventDb, IEventRepository, IEmailService, IEventService, IRequestParams, IServiceGrpcType, IChoiceGrpc } from "../interfaces/eventInterfaces"
// import eventRepository from "../repository/eventRepository";
import nodemailer from 'nodemailer'
import { config } from "dotenv";
import { getServicesByEventNameGrpc } from "../grpc/grpcServiceClient";
import { getUserByIdGrpc } from "../grpc/grpcUserClient";
import { FilterQuery, QueryOptions } from "mongoose";

config()

export class EventServices implements IEventService{

    constructor(
        private eventRepository: IEventRepository,
        private emailService: IEmailService
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


    async totalEvents() {

        try {
            const events = await this.eventRepository.getTotalEvents()
            console.log('getTotalServices service response: ', events);
            if (events) {
                return { success: true, data: events }
            } else {
                return { success: false, message: 'Could not get the total document' }
            }
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from totalEvents service: ', error.message ) : console.log('Unknown error from totalEvents service: ', error )
            return { success: false, message: 'Something went wrong' }
        }

    }

    async addEvent(eventData: Partial<IEvent>) {

        try {

            const newEvent = await this.eventRepository.createEvent(eventData)

            console.log('eventData data: ', eventData);

            console.log('eventData service response: ', newEvent);
            if (newEvent) {
                return { success: true, data: newEvent }
            } else {
                return { success: false, message: 'Could not create service' }
            }
        } catch (error: unknown) {
           error instanceof Error ? console.log('Error message from addEvent service: ', error.message ) : console.log('Unknown error from addEvent service: ', error )
            return { success: false, message: 'Something went wrong' }

        }

    }

    async getEvents(params: IRequestParams) {

        try {
            const { eventName, isActive, pageNumber, pageSize, sortBy, sortOrder } = params
            console.log('search filter params:', eventName, isActive, pageNumber, pageSize, sortBy, sortOrder);
            let filterQ: FilterQuery<IEvent> = {}
            let sortQ: QueryOptions = {}
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


            // let data = await eventRepository.getAllServices(filterQ, sortQ, Number(pageSize), skip)

            let events = await this.eventRepository.getAllEvents(filterQ, { sort: sortQ, limit: Number(pageSize), skip })

            console.log('all service data filtered and sorted: ', events);

            if (events) {
                return { success: true, data:events }
            } else {
                return { success: false, message: 'Could not fetch data' }
            }
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getEvents service: ', error.message ) : console.log('Unknown error from getEvents service: ', error )
            return { success: false, message: 'Something went wrong' }

        }

    }

    async deleteEvent(eventId: string) {
        try {
            const deleteResponse = await this.eventRepository.deleteEvent(eventId)

            console.log('deleteEvent service response: ', deleteResponse);
            if (deleteResponse) {
                return { success: true, data: deleteResponse, message: 'Event deleted successfuly' }
            } else {
                return { success: false, message: 'Could not delete event, Something went wrong' }
            }
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from deleteEvent service: ', error.message ) : console.log('Unknown error from deleteEvent service: ', error )
            return { success: false, message: 'Something went wrong' }

        }

    }

    async getEventById(eventId: string) {
        try {
            const event = await this.eventRepository.getEventById(eventId)

            console.log('getEventById service response: ', event);
            if (event) {
                return { success: true, data: event }
            } else {
                return { success: false, message: 'Could not get event, Something went wrong' }
            }
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getEventById service: ', error.message ) : console.log('Unknown error from getEventById service: ', error )
            return { success: false, message: 'Something went wrong' }

        }

    }

    async editEvent(eventId: string, serviceData: Partial<IEvent>) {
        try {
            const updatedEvent = await this.eventRepository.updateEvent(eventId, { $set: serviceData })

            console.log('updatedEvent: ', updatedEvent);

            if (updatedEvent) {
                return { success: true, data: updatedEvent, message: 'Event updated successfuly' }
            } else {
                return { success: false, message: 'Could not updated event' }
            }
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from editEvent service: ', error.message ) : console.log('Unknown error from editEvent service: ', error )
            return { success: false, message: 'Something went wrong' }

        }

    }

    async editStatus(eventId: string) {
        // provider making the service active or block
        try {
            const event = await this.eventRepository.getEventById(eventId)

            if (event) {
                const eventUpdated = await this.eventRepository.updateEvent(eventId, { $set: { isActive: !event.isActive } })

                console.log('editStatus service: ', event, eventUpdated);

                if (eventUpdated) {
                    return { success: true, data: eventUpdated, message: 'Event status updated' }
                } else {
                    return { success: false, message: 'Could not updated event status' }
                }
            } else {
                return { success: false, message: 'Could not find event details' }
            }

        } catch (error: unknown) {
           error instanceof Error ? console.log('Error message from editStatus service: ', error.message ) : console.log('Unknown error from editStatus service: ', error )
            return { success: false, message: 'Something went wrong' }

        }

    }

    async getServiceByName(name: string) {
        try {
            const service = await getServicesByEventNameGrpc(name)
            console.log('getServiceByName response: ', service.serviceData);
            if (service) {

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
                let serviceSet = new Set()
                service.serviceData.forEach(async (e: IServiceGrpcType) => {
                    serviceSet.add(e.name)
                })
                let servicesArray = Array.from(serviceSet)
                console.log('getServiceByName array: ', servicesArray);

                return { success: true, data: service, extra: servicesArray }
            } else {
                return { success: false, message: 'Could not get event service' }
            }

        } catch (error: unknown) {
           error instanceof Error ? console.log('Error message from getServiceByName service: ', error.message ) : console.log('Unknown error from getServiceByName service: ', error )
            return { success: false, message: 'Something went wrong' }

        }

    }

    async getEventsByName(name: string) {
        try {
            // const service = await getServicesByNameGrpc(name)
            const events: IEvent[] = await this.eventRepository.getEventByName(name)

            console.log('getServiceByName response: ', events);

            const services = await getServicesByEventNameGrpc(name)
            console.log(`Decor services for ${name}: `, services);

            let servicesObj: Record<string,IServiceGrpcType[]> = {}
            if (events && services) {
                services.serviceData.forEach((service: IServiceGrpcType) => {
                    let serviceName = service.name
                    if (!(serviceName in servicesObj)) {
                        servicesObj[serviceName] = []
                    }
                    servicesObj[serviceName].push(service)

                })

                console.log(`sorted services for ${name}: `, servicesObj);

                return { success: true, data: events, extra: servicesObj }
            } else {
                return { success: false, message: 'Could not get event service' }
            }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getEventsByName service: ', error.message ) : console.log('Unknown error from getEventsByName service: ', error )
            return { success: false, message: 'Something went wrong' }

        }

    }

}

// export default new EventServices()
