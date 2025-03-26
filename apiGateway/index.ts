import express, { NextFunction } from 'express'
import { Request, Response } from 'express'
import cors, { CorsOptions } from 'cors'
import fs from 'fs'
import path from 'path'
import cookieParser from 'cookie-parser'
import { createProxyMiddleware, Options } from 'http-proxy-middleware'
import dotenv from 'dotenv'
import morgan from 'morgan'
import logger from './utils/logFile'
import verifyToken from './middlewares/verifyToken'

const app = express()

dotenv.config()

const allowedOrigins: string[] = [
  'http://localhost',       // Frontend on port 80 (Nginx)
  'http://localhost:4200'   // Angular dev server
];


app.use(cors({
  origin: 'http://localhost', // Ensure full URL
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  exposedHeaders: ['Set-Cookie'] // 👈 Expose cookie headers to frontend
}));

app.use(cookieParser())

app.use(logger)

const writeStream = fs.createWriteStream(path.join(__dirname, './utils/data.log'), { flags: 'a' })

// to create custom token eg: ':method'

morgan.token('host', function (req: Request, res: Response) { return req.hostname })

app.use(morgan(':method :url :status [:date[clf]] - :response-time ms :host', { stream: writeStream }))

const services = [
  { path: '/api/user', target: getEnvVal('USER_SERVICE') || 'http://user-service:3001' },
  { path: '/api/service', target: getEnvVal('SERVICES_SERVICE') || 'http://services-service:3002' },
  { path: '/api/event', target: getEnvVal('EVENT_SERVICE') || 'http://event-service:3003' },
  { path: '/api/booking', target: getEnvVal('BOOKING_SERVICE') || 'http://booking-service:3004' },
  { path: '/api/chat', target: getEnvVal('CHAT_SERVICE') || 'http://chat-service:3005' },
  { path: '/', target: getEnvVal('FRONTEND') || 'http://nginx:80' },
]

function getEnvVal(value: string) {
  let target = process.env[value]
  if (!target) {
    throw new Error(`Proxy target for path is undefined!`);
  } else {
    return target
  }
}

interface ProxyOptions {
  path: string;
  target: string;
}
// here each object in the service array is destructured to path and target variables so that it could be used directly
const createProxy = ({ path, target }: ProxyOptions) => {

  // if (!target) return
  if (!target) {
    throw new Error(`Proxy target for path "${path}" is undefined!`);
  }

  if (path === '/api/chat') {
    app.use(path, verifyToken, createProxyMiddleware({
      target,
      changeOrigin: true,
      ws: true, // Enable WebSocket proxying
    }))
  } else {
    app.use(path,
      path === '/' ?
        createProxyMiddleware({
          target,
          changeOrigin: true,
        })
        :
        verifyToken, createProxyMiddleware({
          target,
          changeOrigin: true,
        })
    )
  }


}


services.forEach(createProxy)

app.listen(Number(process.env.PORT) || 4000, "0.0.0.0", () => {
  console.log('Server running on port 4000');

})










