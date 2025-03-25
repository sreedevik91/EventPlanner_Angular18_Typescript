
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../../../../proto/events.proto');

// Load the proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const eventsProto: any = grpc.loadPackageDefinition(packageDefinition).events;

// // Environment-based configuration
// const GRPC_HOST = process.env.NODE_ENV === 'production' 
//   ? 'event-service:50053' 
//   : 'localhost:50053';

const GRPC_HOST=process.env.GRPC_EVENT_SERVER || '0.0.0.0:50053'

// Create a gRPC client
const client = new eventsProto.EventsService(
  GRPC_HOST, // gRPC server address
  grpc.credentials.createInsecure()
);

export const getEventsByGrpc = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    client.GetEvents({}, (err: grpc.ServiceError, response: any) => {
      if (err) {
        reject(new Error(`Failed to fetch services: ${err.message}`));
      } else {
        resolve(response);
      }
    });
  });
};

export const getEventByNameGrpc = (eventName:string): Promise<any> => {
  return new Promise((resolve, reject) => {
    client.GetEventByName({name:eventName}, (err: grpc.ServiceError, response: any) => {
      if (err) {
        reject(new Error(`Failed to fetch services: ${err.message}`));
      } else {
        resolve(response);
      }
    });
  });
};

export const getEventImgGrpc = (eventImg:string): Promise<any> => {
  return new Promise((resolve, reject) => {
    client.GetEventImg({img:eventImg}, (err: grpc.ServiceError, response: any) => {
      if (err) {
        reject(new Error(`Failed to fetch services: ${err.message}`));
      } else {
        resolve(response);
      }
    });
  });
};

export const updateEventWithNewService = (serviceName:string,events:string[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    client.UpdateEventWithNewService({serviceName,events}, (err: grpc.ServiceError, response: any) => {
      if (err) {
        reject(new Error(`Failed to fetch services: ${err.message}`));
      } else {
        resolve(response);
      }
    });
  });
};