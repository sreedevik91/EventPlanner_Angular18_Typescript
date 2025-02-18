import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import path from "path"
import { ServiceRepository } from "../repository/serviceRepository"
import { IService, IServiceDb, IServiceRepository } from "../interfaces/serviceInterfaces"
import { config } from 'dotenv';

config()

const PROTO_PATH = path.join(__dirname, '../../../proto/eventServices.proto')

const packageDefinition = protoLoader.loadSync(PROTO_PATH)
const serviceProto: any = grpc.loadPackageDefinition(packageDefinition).service

const serviceRepository:IServiceRepository=new ServiceRepository()

async function GetAvailableServices(call: any, callback: any) {
    try {
        const services: IService[] = await serviceRepository.getAllServiceByEventName(call.request.serviceName)

        if (services) {
            callback(null, {serviceData:services});
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

async function GetAvailableServicesByProvider(call: any, callback: any) {
    try {
        const services: IService[] = await serviceRepository.getAllServiceByProvider(call.request.providerId)

        if (services) {
            callback(null, {serviceData:services});
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

async function GetAvailableServiceByProviderAndName(call: any, callback: any) {
    try {

        const {serviceName,providerId}= call.request

        const service: IService | null= await serviceRepository.getServiceByProvider(serviceName,providerId)

        if (service) {
            callback(null, {serviceDetails:service});
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

async function GetServiceImg(call: any, callback: any) {
    try {
  
  const imgPath=`${process.env.SERVICE_IMG_URL}${call.request.img}`

    if (imgPath) {
      callback(null, {imgPath});
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
        server.addService(serviceProto.ServiceDetails.service, { GetAvailableServices , GetAvailableServicesByProvider,GetAvailableServiceByProviderAndName,GetServiceImg})
        
        server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {
            console.log('gRPC Server running on port 50052');
            resolve();
        })
    })
}