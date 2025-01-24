import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import path from "path"
import { IGetAvailableServicesResponse } from "../interfaces/chatInterfaces"

const PROTO_PATH=path.join(__dirname,'../../../proto/eventServices.proto')

// Load the proto file
const packageDefinition=protoLoader.loadSync(PROTO_PATH)
const serviceProto:any=grpc.loadPackageDefinition(packageDefinition).service

// Create a gRPC client
const client=new serviceProto.ServiceDetails(
  'localhost:50052', // gRPC server address
  grpc.credentials.createInsecure()
)

// export const getServicesByEventNameGrpc=(name:string):Promise<IGetAvailableServicesResponse[]>=>{
// return new Promise((resolve,reject)=>{
//   client.GetAvailableServices({serviceName:name}, (err: grpc.ServiceError, response: IGetAvailableServicesResponse[]) => {
//     if (err) {
//       reject(new Error(`Failed to fetch services: ${err.message}`));
//     } else {
//       resolve(response);
//     }
//   })
// })
// }

export const getServicesByEventNameGrpc=(name:string):Promise<any>=>{
  return new Promise((resolve,reject)=>{
    client.GetAvailableServices({serviceName:name}, (err: grpc.ServiceError, response: any) => {
      if (err) {
        reject(new Error(`Failed to fetch services: ${err.message}`));
      } else {
        resolve(response);
      }
    })
  })
  }

  export const getServicesByProviderGrpc=(id:string):Promise<any>=>{
    return new Promise((resolve,reject)=>{
      client.GetAvailableServicesByProvider({providerId:id}, (err: grpc.ServiceError, response: any) => {
        if (err) {
          reject(new Error(`Failed to fetch services: ${err.message}`));
        } else {
          resolve(response);
        }
      })
    })
    }

    export const getServicesByProviderAndName=(name:string,providerId:string):Promise<any>=>{
      return new Promise((resolve,reject)=>{
        client.GetAvailableServiceByProviderAndName({serviceName:name,providerId:providerId}, (err: grpc.ServiceError, response: any) => {
          if (err) {
            reject(new Error(`Failed to fetch services: ${err.message}`));
          } else {
            resolve(response);
          }
        })
      })
      }

      export const getServiceImgGrpc = (serviceImg: string): Promise<any> => {
        return new Promise((resolve, reject) => {
          client.GetServiceImg({ img: serviceImg }, (err: grpc.ServiceError, response: any) => {
            if (err) {
              reject(new Error(`Failed to fetch services: ${err.message}`));
            } else {
              resolve(response);
            }
          });
        });
      };