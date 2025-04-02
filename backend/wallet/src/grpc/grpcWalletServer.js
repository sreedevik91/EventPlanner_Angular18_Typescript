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
const walletRepository_1 = require("../repository/walletRepository");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const PROTO_PATH = path_1.default.join(__dirname, '../../../../proto/wallet.proto');
// Load the .proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const walletProto = grpc.loadPackageDefinition(packageDefinition).wallet;
const walletRepository = new walletRepository_1.WalletRepository();
// Implement the gRPC service
function GetWallet(call, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const wallet = yield walletRepository.getWalletByUserId(call.request.userId);
            if (wallet) {
                callback(null, { wallet });
            }
            else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: 'Wallet not found',
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
function UpdateWallet(call, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId, type, amount } = call.request;
            console.log('wallet id, type and amount from grpc: ', userId, type, amount);
            if (!userId || !type || !amount) {
                return callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: 'Invalid user id, transaction type or amount.'
                });
            }
            const userWallet = yield walletRepository.getWalletByUserId(userId);
            let newAmount = 0;
            if (userWallet) {
                newAmount = type === 'credit' ? userWallet.amount + amount : userWallet.amount - amount;
            }
            const updateWallet = yield walletRepository.updateWalletByUserId(userId, { $set: { amount: newAmount }, $push: { transactions: { type: type, amount: amount } } });
            if (updateWallet) {
                callback(null, { updateWallet });
            }
            else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: 'No wallet is updated.',
                });
            }
        }
        catch (error) {
            console.error('Error in UpdateWallet:', error);
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
        server.addService(walletProto.WalletProto.service, { GetWallet, UpdateWallet });
        server.bindAsync(
        // '0.0.0.0:50054',
        process.env.GRPC_WALLET_SERVER, grpc.ServerCredentials.createInsecure(), () => {
            console.log('gRPC Server running on port 50054');
            resolve();
        });
        // Use grpc.ServerCredentials.createSsl() with valid certificates for production environments to encrypt communication.
    });
}
