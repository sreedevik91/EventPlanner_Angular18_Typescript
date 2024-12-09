import express from 'express'
import { Request,Response } from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import cookieParser from 'cookie-parser'
import { createProxyMiddleware } from 'http-proxy-middleware'
import dotenv from 'dotenv'
import morgan from 'morgan'
import logger from './utils/logFile'


const app = express()

dotenv.config()

app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:4200', // Frontend URL
    credentials: true, // Allow cookies to be sent
    
  }))
app.use(logger)

const writeStream=fs.createWriteStream(path.join(__dirname,'./utils/data.log'),{flags:'a'})

// to create custom token eg: ':method'

morgan.token('host', function (req:Request,res:Response){return req.hostname})

app.use(morgan(':method :url :status [:date[clf]] - :response-time ms :host',{stream:writeStream}))

const services = [
    { path: '/user', target: process.env.USER_SERVICE },
    { path: '/service', target: process.env.SERVICES_SERVICE },
    { path: '/', target: process.env.FRONTEND },
]

// const createProxy=(service)=>{
//     app.use(service.path,createProxyMiddleware({
//         target:service.target,
//         changeOrigin:true
//     }))
// }

interface ProxyOptions {
    path: string;
    target?: string;
  }
// here each object in the service array is destructured to path and target variables ao thet it could be used directly
const createProxy=({path,target}:ProxyOptions)=>{
    app.use(path,createProxyMiddleware({
        target,
        changeOrigin:true,
        cookieDomainRewrite: 'localhost'
    }))
}

services.forEach(createProxy)

app.listen(process.env.PORT || 4000, () => {
    console.log('Server running on port 4000');

})