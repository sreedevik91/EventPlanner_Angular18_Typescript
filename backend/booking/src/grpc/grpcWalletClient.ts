
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../../../../proto/wallet.proto');

// Load the proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const walletProto: any = grpc.loadPackageDefinition(packageDefinition).wallet;

const GRPC_HOST=process.env.GRPC_WALLET_SERVER || '0.0.0.0:50054'

// Create a gRPC client
const client = new walletProto.WalletProto(
  GRPC_HOST , // gRPC server address
  grpc.credentials.createInsecure()
);

export const getwalletByGrpc = (userId:string): Promise<any> => {
  return new Promise((resolve, reject) => {
    client.GetWallet({userId}, (err: grpc.ServiceError, response: any) => {
      if (err) {
        reject(new Error(`Failed to fetch services: ${err.message}`));
      } else {
        resolve(response);
      }
    });
  });
};


export const updateWalletByGrpc = (userId:string,type:string,amount:number): Promise<any> => {
  return new Promise((resolve, reject) => {
    client.UpdateWallet({userId,type,amount}, (err: grpc.ServiceError, response: any) => {
      if (err) {
        reject(new Error(`Failed to fetch services: ${err.message}`));
      } else {
        resolve(response);
      }
    });
  });
};