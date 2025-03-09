import express from 'express'
import { Request, Response } from 'express'
import cors, { CorsOptions } from 'cors'
import fs from 'fs'
import path from 'path'
import cookieParser from 'cookie-parser'
import { createProxyMiddleware } from 'http-proxy-middleware'
import dotenv from 'dotenv'
import { match } from 'path-to-regexp'
import morgan from 'morgan'
import logger from './utils/logFile'
import verifyToken from './middlewares/verifyToken'

const app = express()

dotenv.config()

const allowedOrigins:string[] = [
    'http://localhost',       // Frontend on port 80 (Nginx)
    'http://localhost:4200'   // Angular dev server
];

const corsOptions:CorsOptions = {
    // origin: ['http://localhost:4200', 'http://localhost','localhost'], // Frontend URL
    // origin: 'localhost',
    // origin: '*',
    origin: (
        origin: string | undefined, // Type: string | undefined
        callback: (err: Error | null, allow?: boolean) => void // Callback signature
    ) => {

        console.log('Incoming Origin:', origin); // 👈 Log the origin

        // Allow requests with no origin (e.g., curl, Postman)
        if (!origin) return callback(null, true);

        // Validate against allowed origins
        if (allowedOrigins.includes(origin)) {
            console.log('Allowed Origin:', origin); // 👈 Confirm match
            callback(null, true);
        } else {
            console.log('Blocked Origin:', origin); // 👈 Identify mismatches
            callback(new Error(`Origin ${origin} not allowed by CORS`));
        }


        // if (!origin || allowedOrigins.includes(origin)) {
        //     callback(null, true);
        //   } else {
        //     callback(new Error(`Origin ${origin} not allowed by CORS`));
        //   }

    },
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}
app.use(cors(corsOptions))
app.options('*', cors(corsOptions)); // Handle preflight requests
// After setting up CORS middleware, add:
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost'); // 👈 Force override
    next();
  });

app.use(cookieParser())

app.use(logger)

const writeStream = fs.createWriteStream(path.join(__dirname, './utils/data.log'), { flags: 'a' })

// to create custom token eg: ':method'

morgan.token('host', function (req: Request, res: Response) { return req.hostname })

app.use(morgan(':method :url :status [:date[clf]] - :response-time ms :host', { stream: writeStream }))

// const services = [
//     { path: '/api/user', target: process.env.USER_SERVICE },
//     { path: '/api/service', target: process.env.SERVICES_SERVICE },
//     { path: '/api/event', target: process.env.EVENT_SERVICE },
//     { path: '/api/booking', target: process.env.BOOKING_SERVICE },
//     { path: '/api/chat', target: process.env.CHAT_SERVICE },
//     { path: '/', target: process.env.FRONTEND },
// ]

const services = [
    { path: '/api/user', target: getEnvVal('USER_SERVICE') },
    { path: '/api/service', target: getEnvVal('SERVICES_SERVICE') },
    { path: '/api/event', target: getEnvVal('EVENT_SERVICE') },
    { path: '/api/booking', target: getEnvVal('BOOKING_SERVICE') },
    { path: '/api/chat', target: getEnvVal('CHAT_SERVICE') },
    { path: '/', target: getEnvVal('FRONTEND') },
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

    // if (path === '/api/chat') {
    //     app.use(path, verifyToken, createProxyMiddleware({
    //         target,
    //         changeOrigin: true,
    //         ws: true, // Enable WebSocket proxying
    //         cookieDomainRewrite: 'localhost'
    //     }))
    // } else {
    //     app.use(path,
    //         path === '/' ?
    //             createProxyMiddleware({
    //                 target,
    //                 changeOrigin: true,
    //                 cookieDomainRewrite: 'localhost'
    //             })
    //             :
    //             verifyToken, createProxyMiddleware({
    //                 target,
    //                 changeOrigin: true,
    //                 cookieDomainRewrite: 'localhost'
    //             })
    //     )
    // }

    if (!target) {
        throw new Error(`Proxy target for path "${path}" is undefined!`);
    }

    if (path === '/') {
        app.use(path, createProxyMiddleware({
            target,
            changeOrigin: true,
            cookieDomainRewrite: 'localhost'
        }))
    } else {
        app.use(path, verifyToken, createProxyMiddleware({
            target,
            changeOrigin: true,
            ws: path === '/api/chat' ? true : false,
            cookieDomainRewrite: 'localhost'
        }))
    }

    // app.use(path, verifyToken, createProxyMiddleware(
    //     {
    //         target,
    //         changeOrigin: true,
    //         ws:path==='/chat' ? true : false,
    //         cookieDomainRewrite: 'localhost'
    //     }
    // ))

}


// app.use(express.static(path.join(__dirname, './public')));

// app.use('*', (req:Request,res:Response)=>{
//     res.sendFile(path.join(__dirname,'./public/browser/index.html'))
// })

services.forEach(createProxy)

app.listen(process.env.PORT || 4000, () => {
    console.log('Server running on port 4000');

})