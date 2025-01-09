import { IEvent, IEventServices, IEventDb } from "../interfaces/eventInterfaces"
import eventRepository from "../repository/eventRepository";
import nodemailer from 'nodemailer'
import { config } from "dotenv";
import { getServicesByEventNameGrpc } from "../grpc/grpcServiceClient";
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


    async totalEvents() {

        try {
            const data = await eventRepository.getTotalEvents()
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

    async addEvent(eventData: Partial<IEvent>) {

        try {

            const data = await eventRepository.createEvent(eventData)

            console.log('eventData data: ', eventData);

            console.log('eventData service response: ', data);
            if (data) {
                return { success: true, data: data }
            } else {
                return { success: false, message: 'Could not create service' }
            }
        } catch (error: any) {
            console.log('Error from addService service: ', error.message);
        }

    }

    async getEvents(params: any) {

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


            // let data = await eventRepository.getAllServices(filterQ, sortQ, Number(pageSize), skip)

            let data = await eventRepository.getAllEvents(filterQ, { sort: sortQ, limit: Number(pageSize), skip })

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


    async deleteEvent(id: string) {
        try {
            const data = await eventRepository.deleteEvent(id)

            console.log('deleteEvent service response: ', data);
            if (data) {
                return { success: true, data: data, message: 'Event deleted successfuly' }
            } else {
                return { success: false, message: 'Could not delete event, Something went wrong' }
            }
        } catch (error: any) {
            console.log('Error from deleteEvent service: ', error.message);
        }

    }

    async getEventById(id: string) {
        try {
            const data = await eventRepository.getEventById(id)

            console.log('getEventById service response: ', data);
            if (data) {
                return { success: true, data: data }
            } else {
                return { success: false, message: 'Could not get event, Something went wrong' }
            }
        } catch (error: any) {
            console.log('Error from getEventById service: ', error.message);
        }

    }

    async editEvent(id: string, serviceData: Partial<IEvent>) {
        try {
            const updatedEvent = await eventRepository.updateEvent(id, serviceData)

            console.log('updatedEvent: ', updatedEvent);

            if (updatedEvent) {
                return { success: true, data: updatedEvent, message: 'Event updated successfuly' }
            } else {
                return { success: false, message: 'Could not updated event' }
            }
        } catch (error: any) {
            console.log('Error from updatedEvent: ', error.message);
        }

    }

    async editStatus(id: string) {
        // provider making the service active or block
        try {
            const event = await eventRepository.getEventById(id)

            if (event) {
                const eventUpdated = await eventRepository.updateEvent(id, { isActive: !event.isActive })

                console.log('editStatus service: ', event, eventUpdated);

                if (eventUpdated) {
                    return { success: true, data: eventUpdated, message: 'Event status updated' }
                } else {
                    return { success: false, message: 'Could not updated event status' }
                }
            } else {
                return { success: false, message: 'Could not find event details' }
            }

        } catch (error: any) {
            console.log('Error from editStatus event: ', error.message);
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
                service.serviceData.forEach(async (e: any) => {
                    serviceSet.add(e.name)
                })
                let servicesArray = Array.from(serviceSet)
                console.log('getServiceByName array: ', servicesArray);

                return { success: true, data: service, extra: servicesArray }
            } else {
                return { success: false, message: 'Could not get event service' }
            }

        } catch (error: any) {
            console.log('Error from getServiceByName service: ', error, error.message);
        }

    }

    async getEventsByName(name: string) {
        try {
            // const service = await getServicesByNameGrpc(name)
            const events: IEventDb[] = await eventRepository.getEventByName(name)

            console.log('getServiceByName response: ', events);

            const services = await getServicesByEventNameGrpc(name)
            console.log(`Decor services for ${name}: `, services);

            let servicesObj: any = {}
            if (events && services) {
                services.serviceData.forEach((service:any) => {
                   let serviceName=service.name
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

        } catch (error: any) {
            console.log('Error from getServiceByName service: ', error, error.message);
        }

    }



}

export default new EventServices()
