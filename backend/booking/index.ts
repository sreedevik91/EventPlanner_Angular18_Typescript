
import express from "express";
import { config } from "dotenv";
import connectDb from "./src/config/db";
import bookingRoute from "./src/routes/bookingRoutes";
import { errorHandler } from "./src/middlewares/errorHandler";
const app=express()

config()
connectDb()

app.use(express.json())
app.use('/',bookingRoute)
// app.use('/api/booking',bookingRoute)
app.use(errorHandler)

app.listen(process.env.PORT || 3004, () => {
    console.log('booking server running on port 3004');
})
