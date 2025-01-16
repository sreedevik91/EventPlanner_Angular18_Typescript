
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../../../proto/events.proto');

// Load the proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const eventsProto: any = grpc.loadPackageDefinition(packageDefinition).events;

// Create a gRPC client
const client = new eventsProto.EventsService(
  'localhost:50053', // gRPC server address
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

export const updateEventWithNewServiceGrpc = (serviceName:string,events:string[]): Promise<any> => {
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