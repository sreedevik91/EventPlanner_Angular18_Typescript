"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({ url: 'redis://localhost:6379' });
redisClient.connect()
    .then(() => console.log('redis connected'))
    .catch(console.error);
exports.default = redisClient;
