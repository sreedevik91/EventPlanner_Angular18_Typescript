import express from 'express'
const app = express()
import { config } from 'dotenv'

import logger from './src/utils/logFile'
import userRoute from './src/routes/userRoutes'
import connectDb from './src/config/db'

config()
connectDb()

app.use(logger)
app.use('/', userRoute)

// app.use((req, res) => {
//     res.json({ message: '404! Page not found' })
// })

app.listen(process.env.PORT || 3001, () => {
    console.log('user server running on port 3001');
})
