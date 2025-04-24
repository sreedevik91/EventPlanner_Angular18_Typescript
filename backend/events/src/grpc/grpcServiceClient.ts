import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import path from "path"
import { IGetAvailableServicesResponse, IGrpcService, ServicePackage } from "../interfaces/eventInterfaces"

const PROTO_PATH = path.join(__dirname, '../../../../proto/eventServices.proto')

// Load the proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH)
const serviceProto = grpc.loadPackageDefinition(packageDefinition) as unknown as ServicePackage

const GRPC_HOST=process.env.GRPC_SERVICE_SERVER || '0.0.0.0:50052'

// Create a gRPC client
const client = new serviceProto.service.ServiceDetails(
  GRPC_HOST, // gRPC server address
  grpc.credentials.createInsecure()
)

export const getServicesByEventNameGrpc = (name: string): Promise<IGrpcService> => {
  return new Promise((resolve, reject) => {
    client.GetAvailableServices({ serviceName: name }, (err: grpc.ServiceError, response: IGrpcService) => {
      if (err) {
        reject(new Error(`Failed to fetch services: ${err.message}`));
      } else {
        resolve(response);
      }
    })
  })
}

export const getServicesByProviderGrpc = (id: string): Promise<IGrpcService> => {
  return new Promise((resolve, reject) => {
    client.GetAvailableServicesByProvider({ providerId: id }, (err: grpc.ServiceError, response: IGrpcService) => {
      if (err) {
        reject(new Error(`Failed to fetch services: ${err.message}`));
      } else {
        resolve(response);
      }
    })
  })
}

export const getServiceImgGrpc = (serviceImg: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    client.GetServiceImg({ img: serviceImg }, (err: grpc.ServiceError, response: string) => {
      if (err) {
        reject(new Error(`Failed to fetch services: ${err.message}`));
      } else {
        resolve(response);
      }
    });
  });
};