import { IChoice, IService, IServiceDb } from "../interfaces/serviceInterfaces"
import serviceRepository from "../repository/serviceRepository"
import nodemailer from 'nodemailer'
import { config } from "dotenv";
import axios from 'axios'
import { getUserByIdGrpc } from "../grpc/grpcUserClient";
import { log } from "console";
import { updateEventWithNewServiceGrpc } from "../grpc/grpcEventClient";

config()

class ServiceServices {

    axiosInstance = axios.create({
        baseURL: process.env.USER_SERVICE_URL,     // USER_SERVICE_URL='http://localhost:4000'
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true
    })

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


    async totalServices() {

        try {
            const data = await serviceRepository.getTotalServices()
            console.log('getTotalServices service response: ', data);
            if (data) {
                return { success: true, data: data }
            } else {
                return { success: false, message: 'Could not get the total document' }
            }
        } catch (error: any) {
            console.log('Error from getTotalServices service: ', error.message);
            return { success: false, message: error.message };
        }

    }

    async addService(newServiceData: Partial<IService>) {
        try {

            console.log('addService data: ', newServiceData);

            const providerId = newServiceData.provider || ''
            const serviceName = newServiceData.name || ''
            const service = await serviceRepository.getServiceByProvider(serviceName, providerId)
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

                updatedService = await serviceRepository.updateService(service.id, newServiceData)

                console.log('addService existing service update response: ', newServiceData);

            } else {
                console.log('Creating new service with data: ', newServiceData);
                updatedService = await serviceRepository.createService(newServiceData)
                console.log('addService new service response: ', updatedService);

            }
           
            try {
                const updateEventWithService = await updateEventWithNewServiceGrpc(serviceName, updatedService?.events!)
                console.log('grpc updateEventWithService response: ', updateEventWithService);
            } catch (grpcError: any) {
                console.log('grpc updateEventWithService error: ', grpcError.message);
            }

            return updatedService ? { success: true, data: updatedService, message: service ? 'Service updated successfully' : 'New service added successfully' } : { success: false, message: 'Could not update the service' }


        } catch (error: any) {
            console.log('Error from addService service: ', error.message);
            return { success: false, message: error.message };
        }

    }

    async getServices(params: any) {

        try {
            const { serviceName, isApproved, provider, pageNumber, pageSize, sortBy, sortOrder } = params
            console.log('search filter params:', serviceName, provider, pageNumber, pageSize, sortBy, sortOrder);
            let filterQ: any = {}
            let sortQ: any = {}
            let skip = 0
            if (serviceName !== undefined) {
                filterQ.name = { $regex: `.*${serviceName}.*`, $options: 'i' }
                // { $regex: `.*${search}.*`, $options: 'i' } 
            }
            if (provider !== undefined) {
                filterQ.provider = { $regex: `.*${provider}.*`, $options: 'i' }
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

            skip = (Number(pageNumber) - 1) * Number(pageSize)

            console.log('skip: ', skip);


            // let data = await serviceRepository.getAllServices(filterQ, sortQ, Number(pageSize), skip)

            let data = await serviceRepository.getAllServices(filterQ, { sort: sortQ, limit: Number(pageSize), skip })

            // console.log('all service data filtered and sorted: ', data);

            if (data) {
                let extra: any = []
                for (let service of data) {
                    const provider = await getUserByIdGrpc(service.provider)
                    console.log('getUserByIdGrpc provider: ', provider);
                    extra.push({ id: service.provider, name: provider.name })
                }

                console.log('getServices data: ', data);
                console.log('getServices extra: ', extra);
                return { success: true, data, extra }
            } else {
                return { success: false, message: 'Could not fetch data' }
            }
        } catch (error: any) {
            console.log('Error from getServices: ', error.message);
            return { success: false, message: error.message };
        }

    }


    async deleteService(id: string) {
        try {
            const data = await serviceRepository.deleteService(id)

            console.log('deleteService service response: ', data);
            if (data) {
                return { success: true, data: data, message: 'Service deleted successfuly' }
            } else {
                return { success: false, message: 'Could not delete service, Something went wrong' }
            }
        } catch (error: any) {
            console.log('Error from deleteService service: ', error.message);
            return { success: false, message: error.message };
        }

    }

    async getServiceById(id: string) {
        try {
            const data = await serviceRepository.getServiceById(id)

            console.log('getServiceById service response: ', data);
            if (data) {
                return { success: true, data: data }
            } else {
                return { success: false, message: 'Could not delete service, Something went wrong' }
            }
        } catch (error: any) {
            console.log('Error from deleteService service: ', error.message);
            return { success: false, message: error.message };
        }

    }

    async editService(id: string, serviceData: Partial<IService>) {

        try {

            const updatedService = await serviceRepository.updateService(id, serviceData)

            console.log('updatedService: ', updatedService);

            try {
                const updateEventWithService = await updateEventWithNewServiceGrpc(updatedService?.name!, updatedService?.events!)
                console.log('grpc updateEventWithService response: ', updateEventWithService);
            } catch (grpcError:any) {
                console.log('grpc updateEventWithService error: ', grpcError.message);
            }

          return updatedService ? { success: true, data: updatedService, message: 'Service updated successfuly' } : { success: false, message: 'Could not updated service' }

        } catch (error: any) {
            console.log('Error from editService: ', error.message);
            return { success: false, message: error.message };
        }

    }

    async editStatus(id: string) {
        // provider making the service active or block
        try {
            const service = await serviceRepository.getServiceById(id)

            if (service) {
                // service.isActive = !service.isActive
                const serviceUpdated = await serviceRepository.updateService(id, { isActive: !service.isActive })

                // let res = await service.save()
                console.log('editStatus service: ', service, serviceUpdated);

                if (serviceUpdated) {
                    return { success: true, data: serviceUpdated, message: 'Service status updated' }
                } else {
                    return { success: false, message: 'Could not updated service status' }
                }
            } else {
                return { success: false, message: 'Could not find service details' }
            }

        } catch (error: any) {
            console.log('Error from editStatus service: ', error.message);
            return { success: false, message: error.message };
        }

    }

    async approveService(id: string) {

        try {
            // const { email } = data
            // const service = await serviceRepository.getServiceById(id)
            const serviceApproved = await serviceRepository.updateService(id, { isApproved: true })


            // if (service) {
            //     let providerData = await getUserByIdGrpc(service?.provider)
            //     console.log('provider while admin approving the service: ', providerData);
            // }

            if (serviceApproved) {
                // service.isApproved = true
                // const updatedService = await service.save()
                console.log('updatedService data:', serviceApproved);

                let status = serviceApproved.isApproved ? 'approved' : 'pending for approval'

                let providerId = serviceApproved.provider

                // USER_SERVICE_URL='http://localhost:4000/user/'
                // let url = `${process.env.USER_SERVICE_URL}/user/user/${providerId}`
                // console.log('user service url and providerId to get provider data:', url, providerId);

                // let providerData = await this.getProvider(providerId)

                let providerData = await getUserByIdGrpc(providerId)


                console.log('provider while admin approving the service: ', providerData)


                // get provider details from user service using provider id and send mail
                let content = `
            <p>Glad to inform that your account with Dream Events is ${status} by admin.</p>
            <p>May your events get more memorable with us. Happy events!</p>
           `
                let subject = "Account Verified"
                // let provider = providerData.data
                await this.sendMail(providerData.name, providerData.email, content, subject)

                return { success: true, message: 'service approved', data: serviceApproved }
            } else {
                return { success: false, message: 'could not approve service' }

            }
        } catch (error: any) {

            console.log('Error from approveService: ', error.message)
            return { success: false, message: error.message };
        }

    }

    async getServiceByName(name: string) {
        try {
            const aggregatedServiceData = await serviceRepository.getServiceByName(name)
            const allServicesByName = await serviceRepository.getAllServiceByEventName(name)
            console.log('getServiceByName response: ', aggregatedServiceData);
            if (aggregatedServiceData && allServicesByName) {
                aggregatedServiceData.forEach(e => {
                    e.img = Array.from(new Set(e.img))
                    e.events = Array.from(new Set(e.events))
                    e.choicesType = Array.from(new Set(e.choicesType)).filter((e: any) => e !== null && e !== "")
                    e.choiceImg = Array.from(new Set(e.choiceImg))
                    // e.choices.forEach((e:IChoice)=>console.log(e)
                    // )
                })

                console.log('getServiceByName aggregatedServiceData: ', aggregatedServiceData);
                console.log('getServiceByName allServicesByName: ', allServicesByName);
                return { success: true, data: aggregatedServiceData, extra: allServicesByName }
            } else {
                return { success: false, message: 'Could not updated service status' }
            }

        } catch (error: any) {
            console.log('Error from getServiceByName service: ', error.message);
            return { success: false, message: error.message };
        }

    }


}

export default new ServiceServices()
