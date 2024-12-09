import { IService, IServiceDb } from "../interfaces/serviceInterfaces"
import serviceRepository from "../repository/serviceRepository"


class ServiceServices {

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
            const { serviceName,provider, pageNumber, pageSize, sortBy, sortOrder } = params
            console.log('search filter params:', serviceName,provider, pageNumber, pageSize, sortBy, sortOrder);
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

            console.log('sortQ: ', sortQ);

            skip = (Number(pageNumber) - 1) * Number(pageSize)

            console.log('skip: ', skip);


            let data = await serviceRepository.getAllServices(filterQ, sortQ, Number(pageSize), skip)

            if (data) {
                return { success: true, data }
            } else {
                return { success: false, message: 'Could not fetch data' }
            }
        } catch (error: any) {
            console.log('Error from getServices: ', error.message);
        }

    }


    async deleteService(id:string) {
        try {
            const data = await serviceRepository.deleteService(id)

            console.log('deleteService service response: ', data);
            if (data) {
                return { success: true, data: data, message:'Service deleted successfuly' }
            } else {
                return { success: false, message: 'Could not delete service, Something went wrong' }
            }
        } catch (error: any) {
            console.log('Error from deleteService service: ', error.message);
        }

    }
    
    async getServiceById(id:string) {
        try {
            const data = await serviceRepository.getServiceById(id)

            console.log('getServiceById service response: ', data);
            if (data) {
                return { success: true, data: data}
            } else {
                return { success: false, message: 'Could not delete service, Something went wrong' }
            }
        } catch (error: any) {
            console.log('Error from deleteService service: ', error.message);
        }

    }
    
    async editService(id:string,serviceData: Partial<IService>) {
        try {
            const updatedService = await serviceRepository.updateService(id,serviceData)

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
        try {
            const service= await serviceRepository.getServiceById(id)
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
            if (service) {
                service.isApproved = true
                await service.save()
                return { success: true, message: 'service approved', data: service }
            } else {
                return { success: false, message: 'could not approve service' }

            }
        } catch (error: any) {
            console.log('Error from approveService: ', error.message);
        }

    }


}

export default new ServiceServices()