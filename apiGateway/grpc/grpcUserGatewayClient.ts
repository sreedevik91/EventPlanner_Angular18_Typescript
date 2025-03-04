import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'path'

const PROTO_PATH_GATEWAY=path.join(__dirname,'../proto/user.proto')


const packageDefinition=protoLoader.loadSync(PROTO_PATH_GATEWAY)
const userGatewayProto:any=grpc.loadPackageDefinition(packageDefinition).user


const client=new userGatewayProto.UserService(
    'localhost:50051',
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