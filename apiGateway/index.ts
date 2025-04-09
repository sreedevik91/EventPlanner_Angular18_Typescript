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
import { IncomingMessage, ServerResponse } from 'http'
import { Socket } from 'net'

const app = express()

dotenv.config()

app.set('trust proxy', true);

// const allowedOrigins: string[] = [
//   'http://localhost',      // Frontend on port 80 (Nginx)
//   'http://localhost:4200', // Angular dev server
//   'https://dreamevents.shop'
// ];

// app.use(
//   cors({
//     // origin: (origin, callback) => {
//     //   if (!origin || allowedOrigins.includes(origin)) {
//     //     callback(null, origin);
//     //   } else {
//     //     callback(new Error('Not allowed by CORS'));
//     //   }
//     // },
//     origin: 'https://dreamevents.shop',
//     credentials: true, // Allow cookies
//     exposedHeaders: ['Set-Cookie'], // Expose Set-Cookie
//   })
// );




// app.use(cors({
//   // origin: 'http://localhost', // Ensure full URL
//   origin: 'https://dreamevents.shop', // Ensure full URL
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   exposedHeaders: ['Set-Cookie'] // 👈 Expose cookie headers to frontend
// }));

app.use(cookieParser())

app.use(logger)

const writeStream = fs.createWriteStream(path.join(__dirname, './utils/data.log'), { flags: 'a' })

// to create custom token eg: ':method'

morgan.token('host', function (req: Request, res: Response) { return req.hostname })

app.use(morgan(':method :url :status [:date[clf]] - :response-time ms :host', { stream: writeStream }))

// app.get('/health', (req, res) => {
//   res.status(200).send('Welcome to api gateway');
// });


const services = [
  { path: '/api/user', target: getEnvVal('USER_SERVICE') || 'http://user-service:3001' },
  { path: '/api/service', target: getEnvVal('SERVICES_SERVICE') || 'http://services-service:3002' },
  { path: '/api/event', target: getEnvVal('EVENT_SERVICE') || 'http://event-service:3003' },
  { path: '/api/booking', target: getEnvVal('BOOKING_SERVICE') || 'http://booking-service:3004' },
  { path: '/api/chat', target: getEnvVal('CHAT_SERVICE') || 'http://chat-service:3005' },
  { path: '/api/wallet', target: getEnvVal('WALLET_SERVICE') || 'http://wallet-service:3006' },
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
// const createProxy = ({ path, target }: ProxyOptions) => {

//   // if (!target) return
//   if (!target) {
//     throw new Error(`Proxy target for path "${path}" is undefined!`);
//   }

//   if (path === '/api/chat') {
//     app.use(path, verifyToken, createProxyMiddleware({
//       target,
//       changeOrigin: true,
//       ws: true, // Enable WebSocket proxying
//     }))
//   } else {
//     app.use(path,
//       path === '/' ?
//         createProxyMiddleware({
//           target,
//           changeOrigin: true,
//         })
//         :
//         verifyToken, createProxyMiddleware({
//           target,
//           changeOrigin: true,
//         })
//     )
//   }

// }

const createProxy = ({ path, target }: ProxyOptions) => {
  if (!target) {
    throw new Error(`Proxy target for path "${path}" is undefined!`);
  }

  const proxyOptions: Options = {
    target,
    changeOrigin: true,
    cookieDomainRewrite: 'dreamevents.shop',
    pathRewrite: {
      [`^${path}`]: '', // 👈 Strip the base path (e.g., /api/user → '')
    },
    // logLevel: 'debug',
    on: { // 👈 Use "on" with event names
      proxyRes: (proxyRes, req, res) => {
        const cookies = proxyRes.headers['set-cookie'];
        if (cookies && Array.isArray(cookies)) {
          res.setHeader('Set-Cookie', cookies);
          console.log(`Forwarded Cookies for ${req.url}:`, cookies);
        } else if (cookies) {
          res.setHeader('Set-Cookie', [cookies]);
          console.log(`Forwarded Cookie for ${req.url}:`, cookies);
        }
        console.log('Proxy Response Headers:', proxyRes.headers);
      },
      error: (err: Error, req: IncomingMessage, res: ServerResponse<IncomingMessage> | Socket) => {
        console.error(`Proxy Error for ${req.url}:`, err.message);
        if (res instanceof ServerResponse) {
          const serverRes = res as ServerResponse<IncomingMessage>; // ✅ cast after check
          if (!serverRes.headersSent) {
            serverRes.writeHead(500, { 'Content-Type': 'application/json' });
            serverRes.end(JSON.stringify({ error: 'Proxy Error' }));
          }
        }
        // res.status(500).json({ error: 'Proxy Error' });
      },
      proxyReq: (proxyReq, req) => {
        proxyReq.setHeader('X-Forwarded-Proto', 'https');
        console.log('Proxy Request Headers:', req.headers);
      },
    }
    
  };

  if (path === '/api/chat') {
    app.use(path, verifyToken, createProxyMiddleware({
      ...proxyOptions,
      ws: true,
    }));
  } else if (path === '/api/user') {
    // Specific handling for /api/user/auth/google
    app.use(`${path}/auth/google`, (req, res, next) => {
      // Ensure public route for Google callback
      console.log(`Handling /api/user/auth/google for ${req.url}`);
      next();
    }, createProxyMiddleware({
      ...proxyOptions,
      pathRewrite: { [`^${path}/auth/google`]: '/auth/google' },
    }));
    // Catch-all for other /api/user routes
    app.use(path, verifyToken, createProxyMiddleware(proxyOptions));
  } else {
    app.use(path, path === '/' ? createProxyMiddleware(proxyOptions) : verifyToken, createProxyMiddleware(proxyOptions));
  }
};

services.forEach(createProxy)

const serverPort = Number(process.env.PORT) || 4000;
console.log(`Starting server on port ${serverPort}...`);
app.listen(serverPort, "0.0.0.0", () => {
  console.log(`Server running on port ${serverPort}`);
})










