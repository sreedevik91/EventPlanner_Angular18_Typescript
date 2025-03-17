import express from 'express'
import { config } from 'dotenv'
import startGrpcServer from './src/grpc/grpcUserServer'
import logger from './src/utils/logFile'
import userRoute from './src/routes/userRoutes'
import connectDb from './src/config/db'

const app = express()

config()
connectDb()

app.use(logger)
app.use('/', userRoute)
// app.use('/api/user', userRoute)

// app.use((req, res) => {
//     res.json({ message: '404! Page not found' })
// })
// user-service index.ts
app.use((req, res, next) => {
    res.on('finish', () => {
      console.log('Response Headers:', res.getHeaders()); // 👈 Log headers
    });
    next();
  });
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
