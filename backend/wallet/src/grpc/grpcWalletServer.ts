import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { WalletRepository } from '../repository/walletRepository';
import { config } from 'dotenv';
import { IGrpcWalletGetRequest, IGrpcWalletResponse, IGrpcWalletUpdateRequest, IWalletRepository, WalletPackageServer } from '../interfaces/walletInterfaces';

config()

const PROTO_PATH = path.join(__dirname, '../../../../proto/wallet.proto');

// Load the .proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const walletProto = grpc.loadPackageDefinition(packageDefinition) as unknown as WalletPackageServer;
const walletRepository: IWalletRepository = new WalletRepository()

// Implement the gRPC service
async function GetWallet(call: grpc.ServerUnaryCall<IGrpcWalletGetRequest, IGrpcWalletResponse>, callback: grpc.sendUnaryData<IGrpcWalletResponse>) {
    try {
        const wallet = await walletRepository.getWalletByUserId(call.request.userId)

        if (wallet) {
            let walletResponse: IGrpcWalletResponse = {
                id: wallet._id as string,
                amount: wallet.amount,
                transactions: wallet.transactions,
                userId: wallet.userId
            }
            callback(null, walletResponse);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                message: 'Wallet not found',
            });
        }
    } catch (error) {
        callback({
            code: grpc.status.INTERNAL,
            message: 'An internal error occurred',
        });
    }

}

async function UpdateWallet(call: grpc.ServerUnaryCall<IGrpcWalletUpdateRequest,IGrpcWalletResponse>, callback:grpc.sendUnaryData<IGrpcWalletResponse>) {
    try {
        const { userId, type, amount } = call.request
        console.log('wallet id, type and amount from grpc: ', userId, type, amount);
        if (!userId || !type || !amount) {
            return callback({
                code: grpc.status.INVALID_ARGUMENT,
                message: 'Invalid user id, transaction type or amount.'
            })
        }

        const userWallet = await walletRepository.getWalletByUserId(userId)
        let newAmount = 0
        if (userWallet) {

            newAmount = type === 'credit' ? userWallet.amount + amount! : userWallet.amount - amount!
        }

        const updateWallet = await walletRepository.updateWalletByUserId(userId, { $set: { amount: newAmount }, $push: { transactions: { type: type, amount: amount } } })

        if (updateWallet) {

            let walletResponse: IGrpcWalletResponse = {
                id: updateWallet._id as string,
                amount: updateWallet.amount,
                transactions: updateWallet.transactions,
                userId: updateWallet.userId
            }

            callback(null, walletResponse)

        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                message: 'No wallet is updated.',
            })
        }

    } catch (error) {
        console.error('Error in UpdateWallet:', error);
        callback({
            code: grpc.status.INTERNAL,
            message: 'An internal error occurred',
        });
    }

}

export default function startGrpcServer() {
    return new Promise<void>((resolve) => {
        const server = new grpc.Server();
        server.addService(walletProto.wallet.WalletProto.service, { GetWallet, UpdateWallet });

        server.bindAsync(
            // '0.0.0.0:50054',
            process.env.GRPC_WALLET_SERVER!,
            grpc.ServerCredentials.createInsecure(),
            () => {
                console.log('gRPC Server running on port 50054');
                resolve();
            }
        );

        // Use grpc.ServerCredentials.createSsl() with valid certificates for production environments to encrypt communication.

    });
}
