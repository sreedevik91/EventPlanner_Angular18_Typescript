const express = require('express')
const cors = require('cors')
const fs=require('fs')
const path=require('path')
const { createProxyMiddleware } = require('http-proxy-middleware')
const dotenv = require('dotenv')
const morgan=require('morgan')

const app = express()

dotenv.config()

app.use(cors())

const writeStream=fs.createWriteStream(path.join(__dirname,'./utils/data.log'),{flags:'a'})

// to create custom token eg: ':method'

morgan.token('host', function (req,res){return req.hostname})

app.use(morgan(':method :url :status [:date[clf]] - :response-time ms :host',{stream:writeStream}))

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