import express from "express";
import { config } from "dotenv";
import connectDb from "./src/config/db";
import eventRoute from "./src/routes/eventRoutes";
import { errorHandler } from "./src/middlewares/errorHandler";

const app=express()

config()
connectDb()

app.use(express.json())
app.use('/',eventRoute)
app.use(errorHandler)

app.listen(process.env.PORT || 3003, () => {
    console.log('events server running on port 3003');
})
