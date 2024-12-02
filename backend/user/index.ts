import express from 'express'
const app = express()

import logger from './src/utils/logFile'
import userRoute from './src/routes/userRoutes'
import connectDb from './src/config/db'

connectDb()

app.use(logger)
app.use('/', userRoute)

// app.use((req, res) => {
//     res.json({ message: '404! Page not found' })
// })

app.listen(3001, () => {
    console.log('server running on port 3001');
})
