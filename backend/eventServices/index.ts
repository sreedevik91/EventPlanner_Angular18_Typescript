import express from "express";
import { config } from "dotenv";
import connectDb from "./src/config/db";
import serviceRoute from "./src/routes/serviceRoutes";
const app=express()

config()
connectDb()

app.use('/',serviceRoute)

app.listen(process.env.PORT || 3002, () => {
    console.log('service server running on port 3002');
})
