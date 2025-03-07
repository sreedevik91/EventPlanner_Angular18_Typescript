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
const serviceRepository_1 = require("../repository/serviceRepository");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const PROTO_PATH = path_1.default.join(__dirname, '../../../../proto/eventServices.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const serviceProto = grpc.loadPackageDefinition(packageDefinition).service;
const serviceRepository = new serviceRepository_1.ServiceRepository();
function GetAvailableServices(call, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const services = yield serviceRepository.getAllServiceByEventName(call.request.serviceName);
            if (services) {
                callback(null, { serviceData: services });
            }
            else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: 'Services not found',
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
function GetAvailableServicesByProvider(call, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const services = yield serviceRepository.getAllServiceByProvider(call.request.providerId);
            if (services) {
                callback(null, { serviceData: services });
            }
            else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: 'Services not found',
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
function GetAvailableServiceByProviderAndName(call, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { serviceName, providerId } = call.request;
            const service = yield serviceRepository.getServiceByProvider(serviceName, providerId);
            if (service) {
                callback(null, { serviceDetails: service });
            }
            else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: 'Services not found',
                });
            }
        }
        catch (error) {
            callback({
                code: grpc.status.INTERNAL,
                message: 'An internal error occurred'
            });
        }
    });
}
function GetServiceImg(call, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const imgPath = `${process.env.SERVICE_IMG_URL}${call.request.img}`;
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
function startGrpcServer() {
    return new Promise(resolve => {
        const server = new grpc.Server();
        server.addService(serviceProto.ServiceDetails.service, { GetAvailableServices, GetAvailableServicesByProvider, GetAvailableServiceByProviderAndName, GetServiceImg });
        server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {
            console.log('gRPC Server running on port 50052');
            resolve();
        });
    });
}
