import { connect } from "mongoose";

const connectDb=()=>{
    connect('mongodb://0.0.0.0:27017/eventService')
    .then(()=>{
        console.log('events database connected');
    })
    .catch((error)=>{
        console.log(`Error in connecting to database, ${error.message}`);
    })
}

export default connectDb