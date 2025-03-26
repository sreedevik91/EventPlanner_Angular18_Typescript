import { IChoice, IEmailService, IRequestParams, IService, IServiceDb, IServiceRepository, IServicesService, SERVICE_RESPONSES } from "../interfaces/serviceInterfaces"
// import serviceRepository from "../repository/serviceRepository"
import nodemailer from 'nodemailer'
import { config } from "dotenv";
import axios from 'axios'
import { getUserByIdGrpc } from "../grpc/grpcUserClient";
import { log } from "console";
import { updateEventWithNewServiceGrpc } from "../grpc/grpcEventClient";
import { FilterQuery, QueryOptions } from "mongoose";

config()

export class ServiceServices implements IServicesService {

    constructor(
        private serviceRepository: IServiceRepository,
        private emailService: IEmailService
    ) { }

    async totalServices() {

        try {
            const data = await this.serviceRepository.getTotalServices()
            console.log('getTotalServices service response: ', data);
            if (data) {
                return { success: true, data: data }
            } else {
                return { success: false, message: SERVICE_RESPONSES.totalServicesError }
            }
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from totalServices service: ', error.message) : console.log('Unknown error from totalServices service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async addService(newServiceData: Partial<IService>) {
        try {

            console.log('addService data: ', newServiceData);

            const providerId = newServiceData.provider || ''
            const serviceName = newServiceData.name || ''
            const service = await this.serviceRepository.getServiceByProvider(serviceName, providerId)
            console.log('existing service data: ', service);

            let updatedService

            if (service !== null) {
                newServiceData.events?.forEach(event => {
                    if (!service.events.includes(event)) {
                        service.events.push(event)
                    }
                })

                newServiceData.events = service.events

                newServiceData.choices?.forEach(newChoice => {
                    let existingChoice = service.choices.filter(choice => choice.choiceName === newChoice.choiceName)

                    if (existingChoice) {
                        existingChoice[0].choiceName = newChoice.choiceName
                        existingChoice[0].choicePrice = newChoice.choicePrice
                        existingChoice[0].choiceImg = newChoice.choiceImg || existingChoice[0].choiceImg
                        existingChoice[0].choiceType = newChoice.choiceType || existingChoice[0].choiceType
                    } else {
                        service.choices.push(newChoice)
                    }

                })
                newServiceData.choices = service.choices
                console.log('addService existing service final data to update: ', newServiceData);

                updatedService = await this.serviceRepository.updateService(service.id, newServiceData)

                console.log('addService existing service update response: ', newServiceData);

            } else {
                console.log('Creating new service with data: ', newServiceData);
                updatedService = await this.serviceRepository.createService(newServiceData)
                console.log('addService new service response: ', updatedService);

            }

            try {
                const updateEventWithService = await updateEventWithNewServiceGrpc(serviceName, updatedService?.events!)
                console.log('grpc updateEventWithService response: ', updateEventWithService);
            } catch (grpcError: unknown) {
                grpcError instanceof Error ? console.log('Error message from addService service, grpc updateEventWithService error: ', grpcError.message) : console.log('Unknown error from addService service,grpc updateEventWithService error: ', grpcError)
            }

            return updatedService ? { success: true, data: updatedService, message: service ? SERVICE_RESPONSES.addServiceSuccessWithService : SERVICE_RESPONSES.addServiceSuccess } : { success: false, message: SERVICE_RESPONSES.addServiceError }


        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from addService service: ', error.message) : console.log('Unknown error from addService service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async getServices(params: IRequestParams) {

        try {
            const { serviceName, isApproved, provider,providerId, pageNumber, pageSize, sortBy, sortOrder,role } = params
            console.log('search filter params:', serviceName, provider, pageNumber, pageSize, sortBy, sortOrder);
            
            let filterQ: FilterQuery<IService> = {}
            let sortQ: QueryOptions = {}
            let skip = 0
            let limit:number | undefined = undefined
            if (serviceName !== undefined) {
                filterQ.name = { $regex: `.*${serviceName}.*`, $options: 'i' }
            }
           
            if (providerId !== undefined) {
                filterQ.provider = providerId
            }

            if (provider !== undefined) {
                filterQ.isApproved = isApproved
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

            if (pageNumber !== undefined && pageSize !== undefined) {
                skip = (Number(pageNumber) - 1) * Number(pageSize)
            }
            if(pageSize !== undefined && role!=='user') limit=Number(pageSize)

            const options:{sort:QueryOptions,skip:number,limit?:number}={
                sort: sortQ,
                skip
            }

            if(role!=='user') options.limit=limit

            console.log('options: ', options);

            let servicesData = await this.serviceRepository.getServicesAndCount(filterQ, options)

            console.log('all users and total count: ', servicesData);

            if (servicesData) {
                const data = {
                    services: servicesData[0].services.length>0 ? servicesData[0].services : [],
                    count: servicesData[0].servicesCount.length>0 ? servicesData[0].servicesCount[0].totalServices : 0
                }
                console.log('final data: ', data);
                let extra: Record<string, string>[] = []
                for (let service of data.services) {
                    const provider = await getUserByIdGrpc(service.provider)
                    console.log('getUserByIdGrpc provider: ', provider);
                    extra.push({ id: service.provider, name: provider.name })
                }

                console.log('getServices data: ', data);
                console.log('getServices extra: ', extra);
                return { success: true, data, extra }
            } else {
                return { success: false, message: SERVICE_RESPONSES.getServicesError }
            }
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getServices service: ', error.message) : console.log('Unknown error from getServices service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async deleteService(id: string) {
        try {
            const data = await this.serviceRepository.deleteService(id)

            console.log('deleteService service response: ', data);
            if (data) {
                return { success: true, data: data, message:SERVICE_RESPONSES.deleteServiceSuccess }
            } else {
                return { success: false, message: SERVICE_RESPONSES.deleteServiceError }
            }
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from deleteService service: ', error.message) : console.log('Unknown error from deleteService service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async getServiceById(id: string) {
        try {
            console.log('id to get service in getServiceById:', id);
            
            const data = await this.serviceRepository.getServiceById(id)

            console.log('getServiceById service response: ', data);
            if (data) {
                return { success: true, data: data }
            } else {
                return { success: false, message:SERVICE_RESPONSES.getServiceByIdError }
            }
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getServiceById service: ', error.message) : console.log('Unknown error from getServiceById service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async editService(id: string, serviceData: Partial<IService>) {

        try {

            const updatedService = await this.serviceRepository.updateService(id, serviceData)

            console.log('updatedService: ', updatedService);

            try {
                const updateEventWithService = await updateEventWithNewServiceGrpc(updatedService?.name!, updatedService?.events!)
                console.log('grpc updateEventWithService response: ', updateEventWithService);
            } catch (grpcError: unknown) {
                grpcError instanceof Error ? console.log('Error message from editService service,grpc updateEventWithService error: ', grpcError.message) : console.log('Unknown error from editService service,grpc updateEventWithService error: ', grpcError)

            }

            return updatedService ? { success: true, data: updatedService, message:SERVICE_RESPONSES.editServiceSuccess } : { success: false, message:SERVICE_RESPONSES.editServiceError }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from editService service: ', error.message) : console.log('Unknown error from editService service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async editStatus(id: string) {
        // provider making the service active or block
        try {
            const service = await this.serviceRepository.getServiceById(id)

            if (service) {
                const serviceUpdated = await this.serviceRepository.updateService(id, { isActive: !service.isActive })

                console.log('editStatus service: ', service, serviceUpdated);

                if (serviceUpdated) {
                    return { success: true, data: serviceUpdated, message:SERVICE_RESPONSES.editStatusSuccess }
                } else {
                    return { success: false, message:SERVICE_RESPONSES.editStatusError}
                }
            } else {
                return { success: false, message: SERVICE_RESPONSES.editStatusErrorNoService }
            }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from editStatus service: ', error.message) : console.log('Unknown error from editStatus service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async approveService(id: string) {

        try {
            const serviceApproved = await this.serviceRepository.updateService(id, { isApproved: true })

            if (serviceApproved) {
                // service.isApproved = true
                // const updatedService = await service.save()
                console.log('updatedService data:', serviceApproved);

                let status = serviceApproved.isApproved ? 'approved' : 'pending for approval'

                let providerId = serviceApproved.provider

                let providerData = await getUserByIdGrpc(providerId)

                console.log('provider while admin approving the service: ', providerData)

                // get provider details from user service using provider id and send mail
                let content = `
            <p>Glad to inform that your account with Dream Events is ${status} by admin.</p>
            <p>May your events get more memorable with us. Happy events!</p>
           `
                let subject = "Approve Service"
                const isSentMail = await this.emailService.sendMail(providerData.name, providerData.email, content, subject)
                if (!isSentMail) {
                    console.log('Could not send Approve Service email');
                }
                return { success: true, message: SERVICE_RESPONSES.approveServiceSuccess, data: serviceApproved }
            } else {
                return { success: false, message: SERVICE_RESPONSES.approveServiceError}

            }
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from approveService service: ', error.message) : console.log('Unknown error from approveService service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

    async getServiceByName(name: string) {
        try {
            const aggregatedServiceData = await this.serviceRepository.getServiceByName(name)
            const allServicesByName = await this.serviceRepository.getAllServiceByEventName(name)
            console.log('getServiceByName response: ', aggregatedServiceData);
            if (aggregatedServiceData && allServicesByName) {
                aggregatedServiceData.forEach(e => {
                    e.img = Array.from(new Set(e.img))
                    e.events = Array.from(new Set(e.events))
                    e.choicesType = Array.from(new Set(e.choicesType)).filter((e: string) => e !== null && e !== "")
                    e.choiceImg = Array.from(new Set(e.choiceImg))
                   
                })

                console.log('getServiceByName aggregatedServiceData: ', aggregatedServiceData);
                console.log('getServiceByName allServicesByName: ', allServicesByName);
                return { success: true, data: aggregatedServiceData, extra: allServicesByName }
            } else {
                return { success: false, message: SERVICE_RESPONSES.getServiceByNameError}
            }

        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from getServiceByName service: ', error.message) : console.log('Unknown error from getServiceByName service: ', error)
            return { success: false, message: SERVICE_RESPONSES.commonError }
        }

    }

}

