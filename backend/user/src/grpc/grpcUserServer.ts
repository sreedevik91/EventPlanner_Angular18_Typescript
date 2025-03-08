import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { IUserRepository } from '../interfaces/userInterface';
import { UserRepository } from '../repository/userRepository';
import { config } from 'dotenv';

config()

const PROTO_PATH = path.join(__dirname, '../../../../proto/user.proto');

// Load the .proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto: any = grpc.loadPackageDefinition(packageDefinition).user;

const userRepository: IUserRepository = new UserRepository()

// Implement the gRPC service
async function GetUser(call: any, callback: any) {
  try {
    const user = await userRepository.getUserById(call.request.id)

    if (user) {
      callback(null, user);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        message: 'User not found',
      });
    }
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: 'An internal error occurred',
    });
  }

}

export default function startGrpcServer() {
  return new Promise<void>((resolve) => {
    const server = new grpc.Server();
    server.addService(userProto.UserService.service, { GetUser });

    server.bindAsync(
      process.env.GRPC_USER_SERVER!,
      grpc.ServerCredentials.createInsecure(),
      () => {
        console.log('gRPC Server running on port 50051');
        resolve();
      }
    );

    // Use grpc.ServerCredentials.createSsl() with valid certificates for production environments to encrypt communication.

  });
}





