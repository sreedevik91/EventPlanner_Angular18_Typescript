import express from "express";
import { config } from "dotenv";
const app=express()

config()

app.listen(process.env.PORT || 3002, () => {
    console.log('service server running on port 3002');
})
