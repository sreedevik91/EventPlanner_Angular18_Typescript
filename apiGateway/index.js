const express = require('express')
const cors = require('cors')
const { createProxyMiddleware } = require('http-proxy-middleware')
const dotenv = require('dotenv')
const logger=require('./utils/logFile')

const app = express()

dotenv.config()

app.use(cors())

app.use(logger)

const services = [
    { path: '/user', target: process.env.USER_SERVICE },
    { path: '/', target: process.env.FRONTEND },
]

// const createProxy=(service)=>{
//     app.use(service.path,createProxyMiddleware({
//         target:service.target,
//         changeOrigin:true
//     }))
// }

// here each object in the service array is destructured to path and target variables ao thet it could be used directly
const createProxy=({path,target})=>{
    app.use(path,createProxyMiddleware({
        target,
        changeOrigin:true
    }))
}

services.forEach(createProxy)

app.listen(process.env.PORT || 4000, () => {
    console.log('Server running on port 4000');

})