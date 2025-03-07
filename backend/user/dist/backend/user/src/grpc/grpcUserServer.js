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
const userRepository_1 = require("../repository/userRepository");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const PROTO_PATH = path_1.default.join(__dirname, '../../../../proto/user.proto');
// Load the .proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDefinition).user;
const userRepository = new userRepository_1.UserRepository();
// Implement the gRPC service
function GetUser(call, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield userRepository.getUserById(call.request.id);
            if (user) {
                callback(null, user);
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
    return new Promise((resolve) => {
        const server = new grpc.Server();
        server.addService(userProto.UserService.service, { GetUser });
        server.bindAsync(process.env.GRPC_USER_SERVER, grpc.ServerCredentials.createInsecure(), () => {
            console.log('gRPC Server running on port 50051');
            resolve();
        });
        // Use grpc.ServerCredentials.createSsl() with valid certificates for production environments to encrypt communication.
    });
}
