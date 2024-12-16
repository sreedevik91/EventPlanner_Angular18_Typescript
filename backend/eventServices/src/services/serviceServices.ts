import { IService, IServiceDb } from "../interfaces/serviceInterfaces"
import serviceRepository from "../repository/serviceRepository"
import nodemailer from 'nodemailer'
import { config } from "dotenv";
import axios from 'axios'
import { getUserByIdGrpc } from "../grpc/grpcUserClient";

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
        }

    }

    async addService(serviceData: Partial<IService>) {
        try {

            const data = await serviceRepository.createService(serviceData)

            console.log('addService service response: ', data);
            if (data) {
                return { success: true, data: data }
            } else {
                return { success: false, message: 'Could not create service' }
            }
        } catch (error: any) {
            console.log('Error from addService service: ', error.message);
        }

    }

    async getServices(params: any) {

        try {
            const { serviceName,isApproved, provider, pageNumber, pageSize, sortBy, sortOrder } = params
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


            let data = await serviceRepository.getAllServices(filterQ, sortQ, Number(pageSize), skip)
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
        }

    }

    async editService(id: string, serviceData: Partial<IService>) {
        try {
            const updatedService = await serviceRepository.updateService(id, serviceData)

            console.log('updatedService: ', updatedService);

            if (updatedService) {
                return { success: true, data: updatedService, message: 'Service updated successfuly' }
            } else {
                return { success: false, message: 'Could not updated service' }
            }
        } catch (error: any) {
            console.log('Error from editService: ', error.message);
        }

    }

    async editStatus(id: string) {
        // provider making the service active or block
        try {
            const service = await serviceRepository.getServiceById(id)
            if (service) {
                service.isActive = !service.isActive
                let res = await service.save()
                console.log('editStatus service: ', service, res);

                if (res) {
                    return { success: true, data: res, message: 'Service status updated' }
                } else {
                    return { success: false, message: 'Could not updated service status' }
                }
            }

        } catch (error: any) {
            console.log('Error from editStatus service: ', error.message);
        }

    }

    async approveService(id: string) {

        try {
            // const { email } = data
            const service = await serviceRepository.getServiceById(id)

            // if (service) {
            //     let providerData = await getUserByIdGrpc(service?.provider)
            //     console.log('provider while admin approving the service: ', providerData);
            // }

            if (service) {
                service.isApproved = true
                const updatedService = await service.save()
                console.log('updatedService data:', updatedService);

                let status = updatedService.isApproved ? 'approved' : 'pending for approval'

                let providerId = updatedService.provider

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

                return { success: true, message: 'service approved', data: service }
            } else {
                return { success: false, message: 'could not approve service' }

            }
        } catch (error: any) {

            console.log('Error from approveService: ', error.message)
        }

    }

    // private async getProvider(id: string) {
    //     try {
    //         console.log('entered get provider 1');

    //         // const providerResponse = await axios.get(`${process.env.USER_SERVICE_URL}/user/user/${id}`, { withCredentials: true })
    //         // const providerResponse = await this.axiosInstance.get(`/user/user/${id}`)
    //         // const providerResponse = await this.axiosInstance.get(`http://localhost:4000/user/user/${id}`)

    //         const providerResponse = await axios(`http://localhost:4000/user/user/${id}`, {
    //             method: 'GET',
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             withCredentials: true
    //         })


    //         console.log('entered get provider 2');

    //         const providerData = providerResponse.data
    //         console.log('entered get provider 3');

    //         console.log('provider received from user microservice: ', providerResponse, providerData);
    //         return providerData

    //     } catch (error: any) {

    //         if (error.response && error.response.status === 401) {
    //             console.log('entered get provider error ');
    //             try {
    //                 await this.refreshToken()
    //                 // const retryProviderResponse = await axios.get(`${process.env.USER_SERVICE_URL}/user/user/${id}`, { withCredentials: true })
    //                 // const retryProviderResponse = await this.axiosInstance.get(`/user/user/${id}`)

    //                 // const retryProviderResponse = await this.axiosInstance.get(`http://localhost:4000/user/user/${id}`)

    //                 const retryProviderResponse = await axios(`http://localhost:4000/user/user/${id}`, {
    //                     method: 'GET',
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                     },
    //                     withCredentials: true
    //                 })

    //                 const providerData = retryProviderResponse.data
    //                 console.log('provider received from user microservice by refresh token: ', providerData);
    //                 return providerData

    //             } catch (error: any) {
    //                 console.error('Error during token refresh or retry:', error.message);
    //             }

    //         }

    //         console.log('catch error from get provider: ', error.message, error || 'Failed to fetch provider data.');

    //     }
    // }

    // private async refreshToken() {
    //     try {

    //         console.log('Axios baseURL:', this.axiosInstance.defaults.baseURL);
    //         console.log('Final URL:', `${this.axiosInstance.defaults.baseURL}/user/refreshToken`);

    //         // const refreshToken = await axios.get(`${process.env.USER_SERVICE_URL}/user/refreshToken`, { withCredentials: true })

    //         // let refreshToken = await this.axiosInstance.get(`/user/refreshToken`)
    //         // let refreshToken = await this.axiosInstance.get(`http://localhost:4000/user/refreshToken`)

    //         const refreshToken = await axios(`http://localhost:4000/user/refreshToken`, {
    //             method: 'GET',
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             withCredentials: true
    //         })

    //         console.log('refreshToken response from service-services:', refreshToken);
    //         return
    //     } catch (error: any) {
    //         console.log('Error from refreshToken: could not refresh token: - ', error.message);
    //         return
    //     }

    // }

}

export default new ServiceServices()
