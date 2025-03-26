import express from "express";
import { config } from "dotenv";
import connectDb from "./src/config/db";
import eventRoute from "./src/routes/eventRoutes";
import { errorHandler } from "./src/middlewares/errorHandler";
import startGrpcServer from "./src/grpc/grpcEventServer";

const app=express()

config()
connectDb()

app.use(express.json())
app.use('/',eventRoute)
app.use(errorHandler)

const startExpressServer=()=>{
    return new Promise((resolve)=>{
        app.listen(process.env.PORT || 3003, () => {
            console.log('events server running on port 3003');
        })
        resolve(true)
    })
}

(async ()=>{
    Promise.all([startGrpcServer(),startExpressServer()])
})()

