
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { IGrpcUserObj, UserPackage } from '../interfaces/serviceInterfaces';

const PROTO_PATH = path.join(__dirname, '../../../../proto/user.proto');

// Load the proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDefinition) as unknown as UserPackage;

const GRPC_HOST=process.env.GRPC_USER_SERVER || '0.0.0.0:50051'

// Create a gRPC client
const client = new userProto.user.UserService(
  GRPC_HOST, // gRPC server address
  grpc.credentials.createInsecure()
);

export const getUserByIdGrpc = (id: string): Promise<IGrpcUserObj> => {
  return new Promise((resolve, reject) => {
    client.GetUser({ id }, (err: grpc.ServiceError, response: IGrpcUserObj) => {
      if (err) {
        reject(new Error(`Failed to fetch services: ${err.message}`));
      } else {
        resolve(response);
      }
    });
  });
};
