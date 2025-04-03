
import express from "express";
import { config } from "dotenv";
import connectDb from "./src/config/db";
import bookingRoute from "./src/routes/bookingRoutes";
import { errorHandler } from "./src/middlewares/errorHandler";
const app=express()

config()
connectDb()

app.use(express.json())

app.get('/health', (req, res) => {
    res.status(200).send('Welcome to backend-service');
  });

app.use('/',bookingRoute)
app.use(errorHandler)

app.listen(Number(process.env.PORT) || 3004,"0.0.0.0", () => {
    console.log('booking server running on port 3004');
})
