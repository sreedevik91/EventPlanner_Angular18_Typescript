const rfs=require('rotating-file-stream')
const morgan=require('morgan')
const path=require('path')

const logStream=rfs.createStream('app.log',{
    interval:'1d',
    path: path.join(__dirname,'../logs'),
    maxFiles:10
})

// to create custom token eg: ':method'
morgan.token('host',function(req,res){return req.hostname})

const logger=morgan(':method :url :status [:date[clf]] - :response-time ms :host',{stream:logStream})

module.exports=logger