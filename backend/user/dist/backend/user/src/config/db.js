"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
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
    mongoose_1.default.connect(process.env.MONGO_URL)
        .then(() => {
        console.log('database connected');
    })
        .catch((error) => {
        console.log(`Error in connecting to database, ${error.message}`);
    });
};
exports.default = connectDb;
