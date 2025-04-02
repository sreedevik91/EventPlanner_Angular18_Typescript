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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEventWithNewService = exports.getEventImgGrpc = exports.getEventByNameGrpc = exports.getEventsByGrpc = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const path_1 = __importDefault(require("path"));
const PROTO_PATH = path_1.default.join(__dirname, '../../../../proto/events.proto');
// Load the proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const eventsProto = grpc.loadPackageDefinition(packageDefinition).events;
const GRPC_HOST = process.env.GRPC_EVENT_SERVER || '0.0.0.0:50053';
// Create a gRPC client
const client = new eventsProto.EventsService(GRPC_HOST, // gRPC server address
grpc.credentials.createInsecure());
const getEventsByGrpc = () => {
    return new Promise((resolve, reject) => {
        client.GetEvents({}, (err, response) => {
            if (err) {
                reject(new Error(`Failed to fetch services: ${err.message}`));
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.getEventsByGrpc = getEventsByGrpc;
const getEventByNameGrpc = (eventName) => {
    return new Promise((resolve, reject) => {
        client.GetEventByName({ name: eventName }, (err, response) => {
            if (err) {
                reject(new Error(`Failed to fetch services: ${err.message}`));
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.getEventByNameGrpc = getEventByNameGrpc;
const getEventImgGrpc = (eventImg) => {
    return new Promise((resolve, reject) => {
        client.GetEventImg({ img: eventImg }, (err, response) => {
            if (err) {
                reject(new Error(`Failed to fetch services: ${err.message}`));
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.getEventImgGrpc = getEventImgGrpc;
const updateEventWithNewService = (serviceName, events) => {
    return new Promise((resolve, reject) => {
        client.UpdateEventWithNewService({ serviceName, events }, (err, response) => {
            if (err) {
                reject(new Error(`Failed to fetch services: ${err.message}`));
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.updateEventWithNewService = updateEventWithNewService;
