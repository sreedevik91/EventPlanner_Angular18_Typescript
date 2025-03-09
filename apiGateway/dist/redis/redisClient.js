"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({ url: process.env.REDIS_CONNECTION_STRING });
redisClient.connect()
    .then(() => console.log('redis connected'))
    .catch(console.error);
exports.default = redisClient;
