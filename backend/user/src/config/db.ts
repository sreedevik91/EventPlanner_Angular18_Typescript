import mongoose from 'mongoose';
import { config } from "dotenv";

config()

const connectDb = () => {
    mongoose.connect(process.env.MONGO_URL!)
        .then(() => {
            console.log('database connected');
        })
        .catch((error) => {
            console.log(`Error in connecting to database, ${error.message}`);
        })
}

export default connectDb