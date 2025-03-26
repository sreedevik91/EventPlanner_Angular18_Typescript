import { createClient } from "redis";
import { config } from "dotenv";

config()

console.log('Redis URL:', process.env.REDIS_CONNECTION_STRING!); // Debug line

const redisClient =  createClient({ url: process.env.REDIS_CONNECTION_STRING!})
redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.connect()
.then(()=>console.log('redis connected'))
.catch(console.error)

export default redisClient
