
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../../../proto/user.proto');

// Load the proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto: any = grpc.loadPackageDefinition(packageDefinition).user;

// Create a gRPC client
const client = new userProto.UserService(
  'localhost:50051', // gRPC server address
  grpc.credentials.createInsecure()
);

export const getUserByIdGrpc = (id: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    client.GetUser({ id }, (err: grpc.ServiceError, response: any) => {
      if (err) {
        reject(new Error(`Failed to fetch services: ${err.message}`));
      } else {
        resolve(response);
      }
    });
  });
};
