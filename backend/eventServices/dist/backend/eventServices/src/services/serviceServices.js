"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceServices = void 0;
const dotenv_1 = require("dotenv");
const grpcUserClient_1 = require("../grpc/grpcUserClient");
const grpcEventClient_1 = require("../grpc/grpcEventClient");
(0, dotenv_1.config)();
class ServiceServices {
    constructor(serviceRepository, emailService) {
        this.serviceRepository = serviceRepository;
        this.emailService = emailService;
    }
    // axiosInstance = axios.create({
    //     baseURL: process.env.USER_SERVICE_URL,     // USER_SERVICE_URL='http://localhost:4000'
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     withCredentials: true
    // })
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
    totalServices() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.serviceRepository.getTotalServices();
                console.log('getTotalServices service response: ', data);
                if (data) {
                    return { success: true, data: data };
                }
                else {
                    return { success: false, message: 'Could not get the total document' };
                }
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from totalServices service: ', error.message) : console.log('Unknown error from totalServices service: ', error);
                return { success: false, message: 'Something went wrong' };
            }
        });
    }
    addService(newServiceData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                console.log('addService data: ', newServiceData);
                const providerId = newServiceData.provider || '';
                const serviceName = newServiceData.name || '';
                const service = yield this.serviceRepository.getServiceByProvider(serviceName, providerId);
                console.log('existing service data: ', service);
                let updatedService;
                if (service !== null) {
                    (_a = newServiceData.events) === null || _a === void 0 ? void 0 : _a.forEach(event => {
                        if (!service.events.includes(event)) {
                            service.events.push(event);
                        }
                    });
                    newServiceData.events = service.events;
                    (_b = newServiceData.choices) === null || _b === void 0 ? void 0 : _b.forEach(newChoice => {
                        let existingChoice = service.choices.filter(choice => choice.choiceName === newChoice.choiceName);
                        if (existingChoice) {
                            existingChoice[0].choiceName = newChoice.choiceName;
                            existingChoice[0].choicePrice = newChoice.choicePrice;
                            existingChoice[0].choiceImg = newChoice.choiceImg || existingChoice[0].choiceImg;
                            existingChoice[0].choiceType = newChoice.choiceType || existingChoice[0].choiceType;
                        }
                        else {
                            service.choices.push(newChoice);
                        }
                    });
                    newServiceData.choices = service.choices;
                    console.log('addService existing service final data to update: ', newServiceData);
                    updatedService = yield this.serviceRepository.updateService(service.id, newServiceData);
                    console.log('addService existing service update response: ', newServiceData);
                }
                else {
                    console.log('Creating new service with data: ', newServiceData);
                    updatedService = yield this.serviceRepository.createService(newServiceData);
                    console.log('addService new service response: ', updatedService);
                }
                try {
                    const updateEventWithService = yield (0, grpcEventClient_1.updateEventWithNewServiceGrpc)(serviceName, updatedService === null || updatedService === void 0 ? void 0 : updatedService.events);
                    console.log('grpc updateEventWithService response: ', updateEventWithService);
                }
                catch (grpcError) {
                    grpcError instanceof Error ? console.log('Error message from addService service, grpc updateEventWithService error: ', grpcError.message) : console.log('Unknown error from addService service,grpc updateEventWithService error: ', grpcError);
                    // console.log('grpc updateEventWithService error: ', grpcError.message);
                }
                return updatedService ? { success: true, data: updatedService, message: service ? 'Service updated successfully' : 'New service added successfully' } : { success: false, message: 'Could not update the service' };
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from addService service: ', error.message) : console.log('Unknown error from addService service: ', error);
                return { success: false, message: 'Something went wrong' };
            }
        });
    }
    getServices(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { serviceName, isApproved, provider, pageNumber, pageSize, sortBy, sortOrder } = params;
                console.log('search filter params:', serviceName, provider, pageNumber, pageSize, sortBy, sortOrder);
                let filterQ = {};
                let sortQ = {};
                let skip = 0;
                if (serviceName !== undefined) {
                    filterQ.name = { $regex: `.*${serviceName}.*`, $options: 'i' };
                    // { $regex: `.*${search}.*`, $options: 'i' } 
                }
                if (provider !== undefined) {
                    filterQ.provider = { $regex: `.*${provider}.*`, $options: 'i' };
                }
                if (provider !== undefined) {
                    filterQ.isApproved = isApproved;
                }
                if (sortOrder !== undefined && sortBy !== undefined) {
                    let order = sortOrder === 'asc' ? 1 : -1;
                    if (sortBy === 'name') {
                        sortQ.name = order;
                    }
                    else if (sortBy === 'events') {
                        sortQ.events = order;
                    }
                    else if (sortBy === 'isApproved') {
                        sortQ.isApproved = order;
                    }
                    else if (sortBy === 'provider') {
                        sortQ.provider = order;
                    }
                    else if (sortBy === 'isActive') {
                        sortQ.isActive = order;
                    }
                }
                else {
                    sortQ.createdAt = 1;
                }
                console.log('filterQ: ', filterQ);
                console.log('sortQ: ', sortQ);
                skip = (Number(pageNumber) - 1) * Number(pageSize);
                console.log('skip: ', skip);
                // let data = await serviceRepository.getAllServices(filterQ, sortQ, Number(pageSize), skip)
                // let data = await this.serviceRepository.getAllServices(filterQ, { sort: sortQ, limit: Number(pageSize), skip })
                let servicesData = yield this.serviceRepository.getServicesAndCount(filterQ, { sort: sortQ, limit: Number(pageSize), skip });
                console.log('all users and total count: ', servicesData);
                const data = {
                    services: servicesData[0].services,
                    count: servicesData[0].servicesCount[0].totalServices || 0
                };
                if (data) {
                    let extra = [];
                    for (let service of data.services) {
                        const provider = yield (0, grpcUserClient_1.getUserByIdGrpc)(service.provider);
                        console.log('getUserByIdGrpc provider: ', provider);
                        extra.push({ id: service.provider, name: provider.name });
                    }
                    console.log('getServices data: ', data);
                    console.log('getServices extra: ', extra);
                    return { success: true, data, extra };
                }
                else {
                    return { success: false, message: 'Could not fetch data' };
                }
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from getServices service: ', error.message) : console.log('Unknown error from getServices service: ', error);
                return { success: false, message: 'Something went wrong' };
            }
        });
    }
    deleteService(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.serviceRepository.deleteService(id);
                console.log('deleteService service response: ', data);
                if (data) {
                    return { success: true, data: data, message: 'Service deleted successfuly' };
                }
                else {
                    return { success: false, message: 'Could not delete service, Something went wrong' };
                }
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from deleteService service: ', error.message) : console.log('Unknown error from deleteService service: ', error);
                return { success: false, message: 'Something went wrong' };
            }
        });
    }
    getServiceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.serviceRepository.getServiceById(id);
                console.log('getServiceById service response: ', data);
                if (data) {
                    return { success: true, data: data };
                }
                else {
                    return { success: false, message: 'Could not delete service, Something went wrong' };
                }
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from getServiceById service: ', error.message) : console.log('Unknown error from getServiceById service: ', error);
                return { success: false, message: 'Something went wrong' };
            }
        });
    }
    editService(id, serviceData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedService = yield this.serviceRepository.updateService(id, serviceData);
                console.log('updatedService: ', updatedService);
                try {
                    const updateEventWithService = yield (0, grpcEventClient_1.updateEventWithNewServiceGrpc)(updatedService === null || updatedService === void 0 ? void 0 : updatedService.name, updatedService === null || updatedService === void 0 ? void 0 : updatedService.events);
                    console.log('grpc updateEventWithService response: ', updateEventWithService);
                }
                catch (grpcError) {
                    grpcError instanceof Error ? console.log('Error message from editService service,grpc updateEventWithService error: ', grpcError.message) : console.log('Unknown error from editService service,grpc updateEventWithService error: ', grpcError);
                    // console.log('grpc updateEventWithService error: ', grpcError.message);
                }
                return updatedService ? { success: true, data: updatedService, message: 'Service updated successfuly' } : { success: false, message: 'Could not updated service' };
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from editService service: ', error.message) : console.log('Unknown error from editService service: ', error);
                return { success: false, message: 'Something went wrong' };
            }
        });
    }
    editStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // provider making the service active or block
            try {
                const service = yield this.serviceRepository.getServiceById(id);
                if (service) {
                    // service.isActive = !service.isActive
                    const serviceUpdated = yield this.serviceRepository.updateService(id, { isActive: !service.isActive });
                    // let res = await service.save()
                    console.log('editStatus service: ', service, serviceUpdated);
                    if (serviceUpdated) {
                        return { success: true, data: serviceUpdated, message: 'Service status updated' };
                    }
                    else {
                        return { success: false, message: 'Could not updated service status' };
                    }
                }
                else {
                    return { success: false, message: 'Could not find service details' };
                }
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from editStatus service: ', error.message) : console.log('Unknown error from editStatus service: ', error);
                return { success: false, message: 'Something went wrong' };
            }
        });
    }
    approveService(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const { email } = data
                // const service = await serviceRepository.getServiceById(id)
                const serviceApproved = yield this.serviceRepository.updateService(id, { isApproved: true });
                // if (service) {
                //     let providerData = await getUserByIdGrpc(service?.provider)
                //     console.log('provider while admin approving the service: ', providerData);
                // }
                if (serviceApproved) {
                    // service.isApproved = true
                    // const updatedService = await service.save()
                    console.log('updatedService data:', serviceApproved);
                    let status = serviceApproved.isApproved ? 'approved' : 'pending for approval';
                    let providerId = serviceApproved.provider;
                    // USER_SERVICE_URL='http://localhost:4000/user/'
                    // let url = `${process.env.USER_SERVICE_URL}/user/user/${providerId}`
                    // console.log('user service url and providerId to get provider data:', url, providerId);
                    // let providerData = await this.getProvider(providerId)
                    let providerData = yield (0, grpcUserClient_1.getUserByIdGrpc)(providerId);
                    console.log('provider while admin approving the service: ', providerData);
                    // get provider details from user service using provider id and send mail
                    let content = `
            <p>Glad to inform that your account with Dream Events is ${status} by admin.</p>
            <p>May your events get more memorable with us. Happy events!</p>
           `;
                    let subject = "Approve Service";
                    // let provider = providerData.data
                    const isSentMail = yield this.emailService.sendMail(providerData.name, providerData.email, content, subject);
                    if (!isSentMail) {
                        console.log('Could not send Approve Service email');
                    }
                    return { success: true, message: 'service approved', data: serviceApproved };
                }
                else {
                    return { success: false, message: 'could not approve service' };
                }
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from approveService service: ', error.message) : console.log('Unknown error from approveService service: ', error);
                return { success: false, message: 'Something went wrong' };
            }
        });
    }
    getServiceByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const aggregatedServiceData = yield this.serviceRepository.getServiceByName(name);
                const allServicesByName = yield this.serviceRepository.getAllServiceByEventName(name);
                console.log('getServiceByName response: ', aggregatedServiceData);
                if (aggregatedServiceData && allServicesByName) {
                    aggregatedServiceData.forEach(e => {
                        e.img = Array.from(new Set(e.img));
                        e.events = Array.from(new Set(e.events));
                        e.choicesType = Array.from(new Set(e.choicesType)).filter((e) => e !== null && e !== "");
                        e.choiceImg = Array.from(new Set(e.choiceImg));
                        // e.choices.forEach((e:IChoice)=>console.log(e)
                        // )
                    });
                    console.log('getServiceByName aggregatedServiceData: ', aggregatedServiceData);
                    console.log('getServiceByName allServicesByName: ', allServicesByName);
                    return { success: true, data: aggregatedServiceData, extra: allServicesByName };
                }
                else {
                    return { success: false, message: 'Could not updated service status' };
                }
            }
            catch (error) {
                error instanceof Error ? console.log('Error message from getServiceByName service: ', error.message) : console.log('Unknown error from getServiceByName service: ', error);
                return { success: false, message: 'Something went wrong' };
            }
        });
    }
}
exports.ServiceServices = ServiceServices;
// export default new ServiceServices()
