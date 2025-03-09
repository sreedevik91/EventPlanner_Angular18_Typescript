import { createClient } from "redis";
import { config } from "dotenv";

config()

// const redisClient =  createClient({ url: 'redis://localhost:6379' })
console.log('Redis URL:', process.env.REDIS_CONNECTION_STRING!); // Debug line

const redisClient =  createClient({ url: process.env.REDIS_CONNECTION_STRING!})
redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.connect()
.then(()=>console.log('redis connected'))
.catch(console.error)

export default redisClient



// // Add debug logs
// console.log('Redis Connection String:', process.env.REDIS_CONNECTION_STRING);

// const redisClient = createClient({
//   url: process.env.REDIS_CONNECTION_STRING, // NO FALLBACK TO LOCALHOST
// });

// redisClient.on('error', (err) => console.error('Redis Client Error:', err));

// // Explicitly connect (required for Redis v4+)
// redisClient.connect()
// .then(()=>console.log('redis connected'))
// .catch(console.error)

// export default redisClient;


// import { createClient } from "redis";

// const redisClient = createClient({
//   // url: process.env.REDIS_CONNECTION_STRING,
//   url: "redis://redis:6379",
//   socket: {
//     reconnectStrategy: (retries) => {
//       console.log(`Retrying Redis connection: attempt ${retries}`);
//       return Math.min(retries * 100, 5000); // Wait up to 5 seconds
//     },
//   },
// });

// redisClient
//   .on("connect", () => console.log("Redis client connecting..."))
//   .on("ready", () => console.log("Redis client connected!"))
//   .on("error", (err) => console.error("Redis Client Error:", err));

// (async () => {
//   try {
//     await redisClient.connect();
//   } catch (err) {
//     console.error("Failed to connect to Redis:", err);
//     process.exit(1);
//   }
// })();

// export default redisClient;