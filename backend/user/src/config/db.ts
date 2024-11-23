import mongoose from 'mongoose';

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
    mongoose.connect('mongodb://0.0.0.0:27017/userService')
        .then(() => {
            console.log('database connected');
        })
        .catch((error) => {
            console.log(`Error in connecting to database, ${error.message}`);
        })
}

export default connectDb