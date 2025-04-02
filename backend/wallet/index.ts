import express from 'express'
import { config } from 'dotenv'
import startGrpcServer from './src/grpc/grpcWalletServer'
import walletRoute from './src/routes/walletRoutes'
import connectDb from './src/config/db'
import { errorHandler } from './src/middlewares/errorHandler'

const app = express()

config()
connectDb()

app.use('/', walletRoute)
app.use(errorHandler)

const startExpressServer=()=>{
    return new Promise((resolve)=>{
        app.listen(process.env.PORT || 3006, () => {
            console.log('wallet server running on port 3006');
            resolve(true)
        })
    })
}

// Start both Express and gRPC servers
(async () => {
    await Promise.all([
      startExpressServer(),
      startGrpcServer(), // gRPC server
    ]);
    console.log('Both servers are up and running!');
  })();
