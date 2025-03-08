"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = startGrpcServer;
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const path_1 = __importDefault(require("path"));
const eventRepository_1 = require("../repository/eventRepository");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const PROTO_PATH = path_1.default.join(__dirname, '../../../../proto/events.proto');
// Load the .proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const eventsProto = grpc.loadPackageDefinition(packageDefinition).events;
const eventRepository = new eventRepository_1.EventRepository();
// Implement the gRPC service
function GetEvents(call, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const events = yield eventRepository.getAllEvents({}, {});
            if (events) {
                callback(null, { events });
            }
            else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: 'User not found',
                });
            }
        }
        catch (error) {
            callback({
                code: grpc.status.INTERNAL,
                message: 'An internal error occurred',
            });
        }
    });
}
function GetEventByName(call, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const event = yield eventRepository.getEventByName(call.request.name);
            if (event) {
                callback(null, { event });
            }
            else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: 'User not found',
                });
            }
        }
        catch (error) {
            callback({
                code: grpc.status.INTERNAL,
                message: 'An internal error occurred',
            });
        }
    });
}
function GetEventImg(call, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const imgPath = `${process.env.EVENT_IMG_URL}${call.request.img}`;
            if (imgPath) {
                callback(null, { imgPath });
            }
            else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: 'User not found',
                });
            }
        }
        catch (error) {
            callback({
                code: grpc.status.INTERNAL,
                message: 'An internal error occurred',
            });
        }
    });
}
function UpdateEventWithNewService(call, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { serviceName, events } = call.request;
            console.log('getEventByName serviceName, events from grpc: ', serviceName, events);
            // for (let event of events) {
            //   const eventData = await eventRepository.getEventByName(event)
            //   console.log('getEventByName response from grpc: ',eventData);
            //   let success: boolean = false
            //   if (eventData) {
            //     if (!eventData[0].services.includes(serviceName)) {
            //       let eventId: string = eventData[0]._id
            //       const updatedEvent = await eventRepository.updateEvent(eventId, { $push: { services: serviceName } })
            //       if (updatedEvent) {
            //         callback(null, { updatedEvent });
            //       } else {
            //         callback({
            //           code: grpc.status.NOT_FOUND,
            //           message: 'User not found',
            //         });
            //       }
            //     }
            //   }
            // }
            if (!serviceName || !events || !Array.isArray(events)) {
                return callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: 'Invalid serviceName or events array.'
                });
            }
            const updatePromises = events.map((event) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const eventData = yield eventRepository.getEventByName(event);
                    console.log('getEventByName response from grpc: ', eventData);
                    let eventToUpdate = eventData[0];
                    let eventId = eventToUpdate._id;
                    if (!eventData || eventData.length === 0) {
                        console.warn(`Event "${event}" not found in database.`);
                        return null; // Skip if event does not exist
                    }
                    if (!eventToUpdate.services.includes(serviceName)) {
                        console.log(`Updating event "${event}" with service "${serviceName}".`);
                        return yield eventRepository.updateEvent(eventId, { $push: { services: serviceName } });
                    }
                    console.log(`Service "${serviceName}" already associated with event "${event}".`);
                    return null;
                }
                catch (error) {
                    console.error(`Failed to update event:`, error);
                    return null;
                }
            }));
            const results = yield Promise.all(updatePromises);
            const completed = results.filter(res => res !== null);
            console.log('completed updates by grpc:', completed);
            if (completed.length > 0) {
                callback(null, { message: 'Updated Event Services', success: true });
            }
            else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: 'No events were updated.',
                });
            }
        }
        catch (error) {
            console.error('Error in UpdateEventWithNewService:', error);
            callback({
                code: grpc.status.INTERNAL,
                message: 'An internal error occurred',
            });
        }
    });
}
function startGrpcServer() {
    return new Promise((resolve) => {
        const server = new grpc.Server();
        server.addService(eventsProto.EventsService.service, { GetEvents, GetEventByName, GetEventImg, UpdateEventWithNewService });
        server.bindAsync('0.0.0.0:50053', grpc.ServerCredentials.createInsecure(), () => {
            console.log('gRPC Server running on port 50053');
            resolve();
        });
        // Use grpc.ServerCredentials.createSsl() with valid certificates for production environments to encrypt communication.
    });
}
