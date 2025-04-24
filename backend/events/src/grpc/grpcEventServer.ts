import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { EventRepository } from '../repository/eventRepository';
import { config } from 'dotenv';
import { EventsPackage, IEvent, IEventRepository, IGrpcEvent, IGrpcEventByName, IGrpcEventObj, IGrpcGetEventByNameRequest, IGrpcGetEventImgRequest, IGrpcGetEventImgResponse, IGrpcUpdateEventRequest, IGrpcUpdateEventResponse } from '../interfaces/eventInterfaces';

config()

const PROTO_PATH = path.join(__dirname, '../../../../proto/events.proto');

// Load the .proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const eventsProto = grpc.loadPackageDefinition(packageDefinition) as unknown as EventsPackage;
const eventRepository:IEventRepository= new EventRepository()

// Implement the gRPC service
async function GetEvents(call:grpc.ServerUnaryCall<{},IGrpcEvent>, callback:grpc.sendUnaryData<IGrpcEvent>) {
  try {
    const events = await eventRepository.getAllEvents({}, {})

    if (events) {
      let eventResponse:IGrpcEventObj[]=events.map((event:IEvent)=>({
        _id: event._id,
        name: event.name,
        services: event.services,
        isActive: event.isActive,
        img: event.img
      }))
      callback(null, { events:eventResponse });
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

async function GetEventByName(call:grpc.ServerUnaryCall<IGrpcGetEventByNameRequest,IGrpcEventByName>, callback:grpc.sendUnaryData<IGrpcEventByName>) {
  try {
    const event = await eventRepository.getEventByName(call.request.name)

    if (event) {
      callback(null, { event });
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

async function GetEventImg(call:grpc.ServerUnaryCall<IGrpcGetEventImgRequest,IGrpcGetEventImgResponse>, callback:grpc.sendUnaryData<IGrpcGetEventImgResponse>) {
  try {
    const imgPath = `${process.env.EVENT_IMG_URL}${call.request.img}`
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

async function UpdateEventWithNewService(call:grpc.ServerUnaryCall<IGrpcUpdateEventRequest,IGrpcUpdateEventResponse>, callback:grpc.sendUnaryData<IGrpcUpdateEventResponse>) {
  try {
    const { serviceName, events } = call.request
    console.log('getEventByName serviceName, events from grpc: ', serviceName, events);

    if (!serviceName || !events || !Array.isArray(events)) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'Invalid serviceName or events array.'
      })
    }

    const updatePromises = events.map(async (event: string) => {
      try {
        const eventData = await eventRepository.getEventByName(event)
        console.log('getEventByName response from grpc: ', eventData);
       
        if (!eventData || eventData.length === 0) {
          console.warn(`Event "${event}" not found in database.`);
          return null; // Skip if event does not exist
        }
        
        let eventToUpdate = eventData[0]
        let eventId: string = eventToUpdate._id

        if (!eventToUpdate.services.includes(serviceName)) {
          console.log(`Updating event "${event}" with service "${serviceName}".`);
          return await eventRepository.updateEvent(eventId, { $push: { services: serviceName } })
        }
        console.log(`Service "${serviceName}" already associated with event "${event}".`);

        return null

      } catch (error) {
        console.error(`Failed to update event:`, error);
        return null
      }

    })

    const results = await Promise.all(updatePromises)

    const completed = results.filter(res => res !== null)

    console.log('completed updates by grpc:', completed);


    if (completed.length > 0) {

      callback(null, { message: 'Updated Event Services', success: true })

    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        message: 'No events were updated.',
      })
    }

  } catch (error) {
    console.error('Error in UpdateEventWithNewService:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'An internal error occurred',
    });
  }

}

export default function startGrpcServer() {
  return new Promise<void>((resolve) => {
    const server = new grpc.Server();
    server.addService(eventsProto.events.EventsService.service, { GetEvents, GetEventByName, GetEventImg, UpdateEventWithNewService });

    server.bindAsync(
      // '0.0.0.0:50053',
      process.env.GRPC_EVENT_SERVER!,
      grpc.ServerCredentials.createInsecure(),
      () => {
        console.log('gRPC Server running on port 50053');
        resolve();
      }
    );

    // Use grpc.ServerCredentials.createSsl() with valid certificates for production environments to encrypt communication.

  });
}
