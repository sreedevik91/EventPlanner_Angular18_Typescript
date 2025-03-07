"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const connectDb = () => {
    (0, mongoose_1.connect)(process.env.MONGO_URL)
        .then(() => {
        console.log('services database connected');
    })
        .catch((error) => {
        console.log(`Error in connecting to database, ${error.message}`);
    });
};
exports.default = connectDb;
