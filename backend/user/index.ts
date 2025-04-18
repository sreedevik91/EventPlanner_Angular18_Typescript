import express from 'express'
import { config } from 'dotenv'
import startGrpcServer from './src/grpc/grpcUserServer'
import userRoute from './src/routes/userRoutes'
import connectDb from './src/config/db'
import { errorHandler } from './src/middlewares/errorHandler'

const app = express()

app.set('trust proxy', true);

config()
connectDb()

app.get('/health', (req, res) => {
  res.status(200).send('Welcome to user service');
});

app.use('/', userRoute)
app.use(errorHandler)

// user-service index.ts
app.use((req, res, next) => {
    res.on('finish', () => {
      console.log('Response Headers:', res.getHeaders()); // 👈 Log headers
    });
    next();
  });
const startExpressServer=()=>{
    return new Promise((resolve)=>{
        app.listen(Number(process.env.PORT) || 3001,"0.0.0.0", () => {
            console.log('user server running on port 3001');
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
