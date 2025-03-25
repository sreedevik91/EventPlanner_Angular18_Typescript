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


// ================================================================================================================


// const corsOptions: CorsOptions = {
//     // origin: ['http://localhost', 'http://localhost:4200', 'http://api-gateway', 'http://frontend'], // Frontend URL
//     // origin: 'localhost',
//     // origin: '*',
//     // origin: (
//     //     origin: string | undefined, // Type: string | undefined
//     //     callback: (err: Error | null, allow?: boolean) => void // Callback signature
//     // ) => {

//     //     console.log('Incoming Origin:', origin); // 👈 Log the origin

//     //     // Allow requests with no origin (e.g., curl, Postman)
//     //     if (!origin) return callback(null, true);

//     //     // Validate against allowed origins
//     //     if (allowedOrigins.includes(origin)) {
//     //         console.log('Allowed Origin:', origin); // 👈 Confirm match
//     //         callback(null, true);
//     //     } else {
//     //         console.log('Blocked Origin:', origin); // 👈 Identify mismatches
//     //         callback(new Error(`Origin ${origin} not allowed by CORS`));
//     //     }


//     //     // if (!origin || allowedOrigins.includes(origin)) {
//     //     //     callback(null, true);
//     //     //   } else {
//     //     //     callback(new Error(`Origin ${origin} not allowed by CORS`));
//     //     //   }

//     // },

//     origin: function (origin, callback) {
//         const allowedOrigins = ['http://localhost','http://localhost:4200', 'http://api-gateway', 'http://frontend'];

//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, origin); // Allow requests from allowed origins
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Allowed headers
//     credentials: true, // Allow cookies to be sent
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     preflightContinue: false
// }
// app.use(cors(corsOptions))

// app.use(cors({
//     // origin:'localhost',
//     // origin:['http://localhost', 'http://localhost:4200', "http://frontend"],
//     origin:'*',
//     credentials:true
// }))

// ================================================================================================================


app.use(cors({
    // origin: ['http://localhost', 'http://localhost:4200', 'http://frontend', 'http://nginx'], // Ensure full URL
    origin: 'http://localhost', // Ensure full URL
    // origin: (origin, callback) => {
    //     console.log('Received Origin:', origin); // 👈 Log incoming origin

    //     const allowedOrigins = [
    //       'http://localhost',
    //       'http://localhost:4200',
    //       'http://frontend',
    //       'http://nginx'
    //     ];
    //     if (origin && allowedOrigins.includes(origin)) {
    //       callback(null, origin); // 👈 Reflect request origin
    //     } else {
    //       callback(new Error('Not allowed by CORS'));
    //     }

    //     // if (!origin || allowedOrigins.includes(origin)) {
    //     //     callback(null, true); // 👈 Reflect request origin
    //     //   } else {
    //     //     callback(new Error('Not allowed by CORS'));
    //     //   }
    //   },
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    exposedHeaders: ['Set-Cookie'] // 👈 Expose cookie headers to frontend
}));

// app.options('*', cors(corsOptions)); // Handle preflight requests
// After setting up CORS middleware, add:
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost'); // 👈 Force override
//     next();
// });
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
  // { path: '/user', target: 'http://user-service:3001' },
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
          // pathRewrite: {
          //   [`^${path}`]: '', // 👈 Strip the base path (e.g., /api/user → '')
          // },
          ws: true, // Enable WebSocket proxying
          // cookieDomainRewrite: 'localhost'
          // on: { // 👈 Use "on" with event names
          //   proxyRes: (proxyRes, req, res) => {
          //     const headersToRemove = [
          //       'access-control-allow-origin',
          //       'access-control-allow-methods',
          //       'access-control-allow-headers',
          //       'access-control-allow-credentials',
          //       'vary'
          //     ];
      
          //     headersToRemove.forEach(header => {
          //       delete proxyRes.headers[header];
          //       delete proxyRes.headers[header.toUpperCase()];
          //     });
      
          //   }
          // }
      }))
  } else {
      app.use(path,
          path === '/' ?
              createProxyMiddleware({
                  target,
                  changeOrigin: true,
                  // pathRewrite: {
                  //   [`^${path}`]: '', // 👈 Strip the base path (e.g., /api/user → '')
                  // },
                  // // cookieDomainRewrite: 'localhost'
                  // on: { // 👈 Use "on" with event names
                  //   proxyRes: (proxyRes, req, res) => {
                  //     const headersToRemove = [
                  //       'access-control-allow-origin',
                  //       'access-control-allow-methods',
                  //       'access-control-allow-headers',
                  //       'access-control-allow-credentials',
                  //       'vary'
                  //     ];
              
                  //     headersToRemove.forEach(header => {
                  //       delete proxyRes.headers[header];
                  //       delete proxyRes.headers[header.toUpperCase()];
                  //     });
              
                  //   }
                  // }
              })
              :
              verifyToken, createProxyMiddleware({
                  target,
                  changeOrigin: true,
                  // pathRewrite: {
                  //   [`^${path}`]: '', // 👈 Strip the base path (e.g., /api/user → '')
                  // },
                  // // cookieDomainRewrite: 'localhost'
                  // on: { // 👈 Use "on" with event names
                  //   proxyRes: (proxyRes, req, res) => {
                  //     const headersToRemove = [
                  //       'access-control-allow-origin',
                  //       'access-control-allow-methods',
                  //       'access-control-allow-headers',
                  //       'access-control-allow-credentials',
                  //       'vary'
                  //     ];
              
                  //     headersToRemove.forEach(header => {
                  //       delete proxyRes.headers[header];
                  //       delete proxyRes.headers[header.toUpperCase()];
                  //     });
              
                  //   }
                  // }
              })
      )
  }

// ==============================================================================================

  // if (!target) {
  //   throw new Error(`Proxy target for path "${path}" is undefined!`);
  // }

  // const proxyOptions: Options = { // 👈 Explicitly type as Options
  //   target,
  //   changeOrigin: true,
  //   // cookieDomainRewrite: 'localhost',
  //   pathRewrite: {
  //     [`^${path}`]: '', // 👈 Strip the base path (e.g., /api/user → '')
  //   },
  //   // ws: path === '/api/chat',
  //   ws: path === '/api/chat' ? true : false,
  //   on: { // 👈 Use "on" with event names
  //     proxyRes: (proxyRes, req, res) => {
  //       // Delete conflicting CORS headers
  //       // delete proxyRes.headers['access-control-allow-origin'];
  //       // delete proxyRes.headers['access-control-allow-credentials'];
  //       // delete proxyRes.headers['access-control-allow-methods'];
  //       // delete proxyRes.headers['access-control-allow-headers'];

  //       // Case-insensitive deletion of backend CORS headers
  //       // const headers = proxyRes.headers;
  //       // const lowercaseHeaders = Object.keys(headers).reduce((acc, key) => {
  //       //   acc[key.toLowerCase()] = headers[key];
  //       //   return acc;
  //       // }, {} as Record<string, any>);

  //       // delete lowercaseHeaders['access-control-allow-origin'];
  //       // delete lowercaseHeaders['access-control-allow-credentials'];
  //       // delete lowercaseHeaders['access-control-allow-methods'];
  //       // delete lowercaseHeaders['access-control-allow-headers'];

  //       // // Reassign cleaned headers
  //       // proxyRes.headers = lowercaseHeaders;
  //       // Remove ALL CORS headers regardless of case
  //       const headersToRemove = [
  //         'access-control-allow-origin',
  //         'access-control-allow-methods',
  //         'access-control-allow-headers',
  //         'access-control-allow-credentials',
  //         'vary'
  //       ];

  //       headersToRemove.forEach(header => {
  //         delete proxyRes.headers[header];
  //         delete proxyRes.headers[header.toUpperCase()];
  //       });

  //     }
  //   }
  // };

  // if (path === '/') {
  //   app.use(path, createProxyMiddleware(proxyOptions));
  // } else {
  //   app.use(path, verifyToken, createProxyMiddleware(proxyOptions));
  // }

// ===============================================================================


  // if (!target) {
  //   throw new Error(`Proxy target for path "${path}" is undefined!`);
  // }

  // if (path === '/') {
  //     app.use(path, createProxyMiddleware({
  //         target,
  //         changeOrigin: true,
  //         cookieDomainRewrite: 'localhost',
  //         on: {
  //             proxyRes: (proxyRes, req, res) => {
  //                 // proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin || 'http://localhost';
  //                 // proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';

  //                 // 👇 Remove conflicting CORS headers from backend services
  //                 delete proxyRes.headers['access-control-allow-origin'];
  //                 delete proxyRes.headers['access-control-allow-credentials'];
  //                 delete proxyRes.headers['access-control-allow-methods'];
  //                 delete proxyRes.headers['access-control-allow-headers'];
  //             }
  //         }
  //     }))
  // } else {
  //     app.use(path, verifyToken, createProxyMiddleware({
  //         target,
  //         changeOrigin: true,
  //         ws: path === '/api/chat' ? true : false,
  //         cookieDomainRewrite: 'localhost',
  //         on: {
  //             proxyRes: (proxyRes, req, res) => {
  //                 // proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin || 'http://localhost';
  //                 // proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';

  //                 // 👇 Remove conflicting CORS headers from backend services
  //                 delete proxyRes.headers['access-control-allow-origin'];
  //                 delete proxyRes.headers['access-control-allow-credentials'];
  //                 delete proxyRes.headers['access-control-allow-methods'];
  //                 delete proxyRes.headers['access-control-allow-headers'];
  //             }
  //         }
  //     }))
  // }

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

// app.use((req:Request, res:Response, next:NextFunction) => {
//     const allowedOrigins = ['http://localhost:4200', 'http://api-gateway', 'http://frontend'];

//     if(!req.headers) return

//     if (allowedOrigins.includes(req.headers.origin!)) {
//         res.setHeader('Access-Control-Allow-Origin', req.headers.origin!);
//     }

//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

//     console.log('Final Response Headers:', res.getHeaders());
//     next();
// });


// app.use((req, res, next) => {
//     console.log('Incoming Request Origin:', req.headers.origin);
//     next();
// });
// app.use((req, res, next) => {
//     console.log('Final Response Headers:', res.getHeaders());
//     next();
// });


services.forEach(createProxy)

app.listen(Number(process.env.PORT) || 4000, "0.0.0.0", () => {
  console.log('Server running on port 4000');

})










