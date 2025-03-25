
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../../../../proto/user.proto');

// Load the proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto: any = grpc.loadPackageDefinition(packageDefinition).user;

// // Environment-based configuration
// const GRPC_HOST = process.env.NODE_ENV === 'production' 
//   ? 'user-service:50051' 
//   : 'localhost:50051';

const GRPC_HOST=process.env.GRPC_USER_SERVER || '0.0.0.0:50051'

// Create a gRPC client
const client = new userProto.UserService(
  GRPC_HOST, // gRPC server address
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
