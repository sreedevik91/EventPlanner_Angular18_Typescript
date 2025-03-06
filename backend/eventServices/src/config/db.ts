import { connect } from "mongoose";
import { config } from "dotenv";

config()

const connectDb=()=>{
    connect(process.env.MONGO_URL!)
    .then(()=>{
        console.log('services database connected');
    })
    .catch((error)=>{
        console.log(`Error in connecting to database, ${error.message}`);
    })
}

export default connectDb