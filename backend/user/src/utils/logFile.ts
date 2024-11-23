import {createStream} from 'rotating-file-stream';
import { Request,Response } from 'express'
import morgan from 'morgan'
import path from 'path'

const logStream= createStream('app.log',{
    interval:'1d',
    path: path.join(__dirname,'../logs'),
    size:'10M'
})

// to create custom token eg: ':method'
morgan.token('host',function(req:Request,res:Response){return req.hostname})

const logger=morgan(':method :url :status [:date[clf]] - :response-time ms :host',{stream:logStream})

// module.exports=logger
export default logger