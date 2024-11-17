const express = require('express')
const app = express()
const fs=require('fs')
const morgan=require('morgan')
const path=require('path')

const userRoute = require('./src/routes/userRoutes')
const connectDb = require('./src/config/db')

connectDb()

const writeStream=fs.createWriteStream(path.join(__dirname,'./src/utils/data.log'),{flags:'a'})

// to create custom token eg: ':method'

morgan.token('host', function (req,res){return req.hostname})

app.use(morgan(':method :url :status [:date[clf]] - :response-time ms :host',{stream:writeStream}))


// app.get('/', (req, res) => {
//     res.send('Backend server running .....')
// })

app.use('/', userRoute)

// app.use((req, res) => {
//     res.json({ message: '404! Page not found' })
// })

app.listen(3001, () => {
    console.log('server running on port 3001');
})
