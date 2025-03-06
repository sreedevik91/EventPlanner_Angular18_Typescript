import mongoose from 'mongoose';
import { config } from "dotenv";

config()

// to run in the docker container

// const connectDb = () => {
//     mongoose.connect('mongodb://user_db_container:27017/userService')
//         .then(() => {
//             console.log('database connected');
//         })
//         .catch((error) => {
//             console.log(`Error in connecting to database, ${error.message}`);
//         })
// }

//to run locally and test

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