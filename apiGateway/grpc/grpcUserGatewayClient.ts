import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'path'

const PROTO_PATH_GATEWAY=path.join(__dirname,'../../proto/user.proto')

const packageDefinition=protoLoader.loadSync(PROTO_PATH_GATEWAY)
const userGatewayProto:any=grpc.loadPackageDefinition(packageDefinition).user

// Environment-based configuration
// const GRPC_HOST = process.env.NODE_ENV === 'production' 
//   ? 'user-service:50051' 
//   : 'localhost:50051';

const GRPC_HOST=process.env.GRPC_USER_SERVER || '0.0.0.0:50051'

const client=new userGatewayProto.UserService(
    GRPC_HOST,
    grpc.credentials.createInsecure()
)

export const getUserByIdGrpcGateway=(id:string):Promise<any>=>{
    return new Promise((resolve,reject)=>{
        client.GetUser({id}, (err:any,res:any)=>{
            if (err){
                reject(err)
            }else{
                resolve(res)
            }
        })
    })
}