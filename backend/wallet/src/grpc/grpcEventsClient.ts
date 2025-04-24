
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { EventsPackage, IGrpcEvent, IGrpcEventByName, IGrpcUpdateEventResponse } from '../interfaces/walletInterfaces';

const PROTO_PATH = path.join(__dirname, '../../../../proto/events.proto');

// Load the proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const eventsProto= grpc.loadPackageDefinition(packageDefinition) as unknown as EventsPackage;

const GRPC_HOST=process.env.GRPC_EVENT_SERVER || '0.0.0.0:50053'

// Create a gRPC client
const client = new eventsProto.events.EventsService(
  GRPC_HOST , // gRPC server address
  grpc.credentials.createInsecure()
);

export const getEventsByGrpc = (): Promise<IGrpcEvent> => {
  return new Promise((resolve, reject) => {
    client.GetEvents({}, (err: grpc.ServiceError, response: IGrpcEvent) => {
      if (err) {
        reject(new Error(`Failed to fetch services: ${err.message}`));
      } else {
        resolve(response);
      }
    });
  });
};

export const getEventByNameGrpc = (eventName:string): Promise<IGrpcEventByName> => {
  return new Promise((resolve, reject) => {
    client.GetEventByName({name:eventName}, (err: grpc.ServiceError, response: IGrpcEventByName) => {
      if (err) {
        reject(new Error(`Failed to fetch services: ${err.message}`));
      } else {
        resolve(response);
      }
    });
  });
};

export const getEventImgGrpc = (eventImg:string): Promise<string> => {
  return new Promise((resolve, reject) => {
    client.GetEventImg({img:eventImg}, (err: grpc.ServiceError, response: string) => {
      if (err) {
        reject(new Error(`Failed to fetch services: ${err.message}`));
      } else {
        resolve(response);
      }
    });
  });
};

export const updateEventWithNewService = (serviceName:string,events:string[]): Promise<IGrpcUpdateEventResponse> => {
  return new Promise((resolve, reject) => {
    client.UpdateEventWithNewService({serviceName,events}, (err: grpc.ServiceError, response: IGrpcUpdateEventResponse) => {
      if (err) {
        reject(new Error(`Failed to fetch services: ${err.message}`));
      } else {
        resolve(response);
      }
    });
  });
};