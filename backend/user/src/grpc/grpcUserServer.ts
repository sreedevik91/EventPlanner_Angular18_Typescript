import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import userRepository from '../repository/userRepository';

const PROTO_PATH = path.join(__dirname, '../../../proto/user.proto');

// Load the .proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto: any = grpc.loadPackageDefinition(packageDefinition).user;

// Implement the gRPC service
async function GetUser(call: any, callback: any) {
  const user =await userRepository.getUserById(call.request.id)
  if (user) {
    callback(null, user);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      message: 'User not found',
    });
  }
}

export default function startGrpcServer() {
  return new Promise<void>((resolve) => {
    const server = new grpc.Server();
    server.addService(userProto.UserService.service, { GetUser });

    server.bindAsync(
      '0.0.0.0:50051',
      grpc.ServerCredentials.createInsecure(),
      () => {
        console.log('gRPC Server running on port 50051');
        resolve();
      }
    );
  });
}
