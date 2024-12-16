import express from 'express'
const app = express()
import { config } from 'dotenv'
import startGrpcServer from './src/grpc/grpcUserServer'
// import cors from 'cors'
// import cookieParser from 'cookie-parser'


import logger from './src/utils/logFile'
import userRoute from './src/routes/userRoutes'
import connectDb from './src/config/db'
import { resolve } from 'path'

config()
connectDb()

// app.use(cookieParser())
// app.use(cors({
//     origin: 'http://localhost:4000', // API Gateway
//     credentials: true,
// }));

app.use(logger)
app.use('/', userRoute)



// app.use((req, res) => {
//     res.json({ message: '404! Page not found' })
// })

const startExpressServer=()=>{
    return new Promise((resolve)=>{
        app.listen(process.env.PORT || 3001, () => {
            console.log('user server running on port 3001');
            resolve(true)
        })
    })
}

// app.listen(process.env.PORT || 3001, () => {
//     console.log('user server running on port 3001');
// })

// Start both Express and gRPC servers
(async () => {
    await Promise.all([
      startExpressServer(),
      startGrpcServer(), // gRPC server
    ]);
    console.log('Both servers are up and running!');
  })();
