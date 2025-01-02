import express from "express";
import { config } from "dotenv";
import connectDb from "./src/config/db";
import eventRoute from "./src/routes/eventRoutes";
const app=express()

config()
connectDb()

app.use('/',eventRoute)

app.listen(process.env.PORT || 3003, () => {
    console.log('service server running on port 3003');
})
