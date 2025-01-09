import express from "express";
import { config } from "dotenv";
import connectDb from "./src/config/db";
import serviceRoute from "./src/routes/serviceRoutes";
import path from "path";
import startGrpcServer from "./src/grpc/grpcServiceServer";
// import cors from 'cors'
// import cookieParser from 'cookie-parser'
const app=express()

config()
connectDb()

// app.use(cookieParser())
// app.use(cors({
//     origin: 'http://localhost:4000', // API Gateway
//     credentials: true,
// }));

// app.use(express.static(path.join(__dirname, './src/public')));
// console.log('imagePath from service index.ts:', path.join(__dirname, './src/public'));

// app.use(express.static('public'));

app.use('/',serviceRoute)

const startExpressServer=()=>{
    return new Promise(resolve=>{
        app.listen(process.env.PORT || 3002, () => {
            console.log('service server running on port 3002');
        })
        resolve(true)
    })
}
(async ()=>{
    await Promise.all([startGrpcServer(),startExpressServer()])
    console.log('Both servers are up and running!');
    
})()

