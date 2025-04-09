import express from "express";
import { config } from "dotenv";
import connectDb from "./src/config/db";
import serviceRoute from "./src/routes/serviceRoutes";
import startGrpcServer from "./src/grpc/grpcServiceServer";
import { errorHandler } from "./src/middlewares/errorHandler";
const app=express()

app.set('trust proxy', true);

config()
connectDb()

app.get('/health', (req, res) => {
    res.status(200).send('Welcome to services service');
  });

app.use('/',serviceRoute)
app.use(errorHandler)

const startExpressServer=()=>{
    return new Promise(resolve=>{
        app.listen(Number(process.env.PORT) || 3002,"0.0.0.0", () => {
            console.log('service server running on port 3002');
        })
        resolve(true)
    })
}
(async ()=>{
    await Promise.all([startGrpcServer(),startExpressServer()])
    console.log('Both servers are up and running!');
    
})()

