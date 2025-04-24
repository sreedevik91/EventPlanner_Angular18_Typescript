import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import path from "path"
import { ServiceRepository } from "../repository/serviceRepository"
import { IGrpcGetAvailableServiceByProviderAndNameRequest, IGrpcGetAvailableServicesByProviderRequest, IGrpcGetAvailableServicesRequest, IGrpcGetServiceImgRequest, IGrpcGetServiceImgResponse, IGrpcService, IGrpcServiceByProvider, IGrpcServiceObj, IService, IServiceDb, IServiceRepository, ServicePackage } from "../interfaces/serviceInterfaces"
import { config } from 'dotenv';

config()

const PROTO_PATH = path.join(__dirname, '../../../../proto/eventServices.proto')

const packageDefinition = protoLoader.loadSync(PROTO_PATH)
const serviceProto = grpc.loadPackageDefinition(packageDefinition) as unknown as ServicePackage

const serviceRepository: IServiceRepository = new ServiceRepository()

async function GetAvailableServices(call: grpc.ServerUnaryCall<IGrpcGetAvailableServicesRequest, IGrpcService>, callback: grpc.sendUnaryData<IGrpcService>) {
    try {
        const services = await serviceRepository.getAllServiceByEventName(call.request.serviceName)

        if (services) {
            let serviceResponse: IGrpcServiceObj[] = services.map((service: IService) => ({
                id: service._id as string,
                name: service.name,
                provider: service.provider,
                events: service.events,
                choices: service.choices,
                img: service.img
            }))
            callback(null, { serviceData: serviceResponse });
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                message: 'Services not found',
            });
        }
    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            message: 'An internal error occurred',
        });
    }
}

async function GetAvailableServicesByProvider(call: grpc.ServerUnaryCall<IGrpcGetAvailableServicesByProviderRequest, IGrpcService>, callback: grpc.sendUnaryData<IGrpcService>) {
    try {
        const services: IService[] | null = await serviceRepository.getAllServiceByProvider(call.request.providerId)

        if (services) {
            let serviceResponse: IGrpcServiceObj[] = services.map((service: IService) => ({
                id: service._id as string,
                name: service.name,
                provider: service.provider,
                events: service.events,
                choices: service.choices,
                img: service.img
            }))
            callback(null, { serviceData: serviceResponse });
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                message: 'Services not found',
            });
        }
    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            message: 'An internal error occurred',
        });
    }
}

async function GetAvailableServiceByProviderAndName(call: grpc.ServerUnaryCall<IGrpcGetAvailableServiceByProviderAndNameRequest, IGrpcServiceByProvider>, callback: grpc.sendUnaryData<IGrpcServiceByProvider>) {
    try {

        const { serviceName, providerId } = call.request

        const service: IService | null = await serviceRepository.getServiceByProvider(serviceName, providerId)

        if (service) {
            let serviceResponse: IGrpcServiceObj = {
                id: service._id as string,
                name: service.name,
                provider: service.provider,
                events: service.events,
                choices: service.choices,
                img: service.img
            }
            callback(null, { serviceDetails: serviceResponse });
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                message: 'Services not found',
            });
        }
    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            message: 'An internal error occurred'
        });
    }
}

async function GetServiceImg(call: grpc.ServerUnaryCall<IGrpcGetServiceImgRequest, IGrpcGetServiceImgResponse>, callback: grpc.sendUnaryData<IGrpcGetServiceImgResponse>) {
    try {

        const imgPath = `${process.env.SERVICE_IMG_URL}${call.request.img}`

        if (imgPath) {
            callback(null, { imgPath });
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                message: 'User not found',
            });
        }
    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            message: 'An internal error occurred',
        });
    }

}

export default function startGrpcServer() {
    return new Promise<void>(resolve => {
        const server = new grpc.Server()
        server.addService(serviceProto.service.ServiceDetails.service, { GetAvailableServices, GetAvailableServicesByProvider, GetAvailableServiceByProviderAndName, GetServiceImg })

        server.bindAsync(
            // '0.0.0.0:50052',
            process.env.GRPC_SERVICE_SERVER!,
            grpc.ServerCredentials.createInsecure(), () => {
                console.log('gRPC Server running on port 50052');
                resolve();
            })
    })
}

