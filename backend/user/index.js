const express = require('express')
const app = express()

const logger=require('./src/utils/logFile')
const userRoute = require('./src/routes/userRoutes')
const connectDb = require('./src/config/db')

connectDb()

// app.get('/', (req, res) => {
//     res.send('Backend server running .....')
// })

app.use(logger)
app.use('/', userRoute)

// app.use((req, res) => {
//     res.json({ message: '404! Page not found' })
// })

app.listen(3001, () => {
    console.log('server running on port 3001');
})
