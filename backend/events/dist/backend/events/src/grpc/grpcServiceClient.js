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
exports.getServiceImgGrpc = exports.getServicesByProviderGrpc = exports.getServicesByEventNameGrpc = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const path_1 = __importDefault(require("path"));
const PROTO_PATH = path_1.default.join(__dirname, '../../../../proto/eventServices.proto');
// Load the proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const serviceProto = grpc.loadPackageDefinition(packageDefinition).service;
// Create a gRPC client
const client = new serviceProto.ServiceDetails('localhost:50052', // gRPC server address
grpc.credentials.createInsecure());
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
const getServicesByEventNameGrpc = (name) => {
    return new Promise((resolve, reject) => {
        client.GetAvailableServices({ serviceName: name }, (err, response) => {
            if (err) {
                reject(new Error(`Failed to fetch services: ${err.message}`));
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.getServicesByEventNameGrpc = getServicesByEventNameGrpc;
const getServicesByProviderGrpc = (id) => {
    return new Promise((resolve, reject) => {
        client.GetAvailableServicesByProvider({ providerId: id }, (err, response) => {
            if (err) {
                reject(new Error(`Failed to fetch services: ${err.message}`));
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.getServicesByProviderGrpc = getServicesByProviderGrpc;
const getServiceImgGrpc = (serviceImg) => {
    return new Promise((resolve, reject) => {
        client.GetServiceImg({ img: serviceImg }, (err, response) => {
            if (err) {
                reject(new Error(`Failed to fetch services: ${err.message}`));
            }
            else {
                resolve(response);
            }
        });
    });
};
exports.getServiceImgGrpc = getServiceImgGrpc;
