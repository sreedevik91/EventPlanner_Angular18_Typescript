import { createClient } from "redis";
import { config } from "dotenv";

config()

console.log('Redis URL:', process.env.REDIS_CONNECTION_STRING!); // Debug line
const redisClient =  createClient({ url: process.env.REDIS_CONNECTION_STRING!})

// Parse the Azure Cache for Redis connection string
// Redis client setup
// console.log('Starting Redis client initialization...');
// const connectionString = process.env.REDIS_CONNECTION_STRING;
// if (!connectionString) {
//   console.error('REDIS_CONNECTION_STRING is not defined');
//   process.exit(1);
// }

// const [hostPort, params] = connectionString.split(',');
// const [host, port] = hostPort.split(':');
// const passwordMatch = params.match(/password=([^,]+)/);
// const password = passwordMatch ? passwordMatch[1] : undefined;
// const redisUrl = `rediss://${password ? `:${password}@` : ''}${host}:${port}`;

// const redisClient = createClient({
//   url: redisUrl,
//   socket: {
//     tls: true,
//     rejectUnauthorized: false
//   }
// });

redisClient.on('error', (err) => console.error('Redis Client Error:', err));

console.log('Attempting to connect to Redis...');
redisClient.connect()
  .then(() => console.log('Redis connected successfully'))
  .catch((err) => {
    console.error('Redis connection failed:', err);
    // process.exit(1); // Exit to ensure the container fails fast if Redis is critical
  });

// redisClient.on('error', (err) => console.error('Redis Client Error:', err));
// redisClient.connect()
// .then(()=>console.log('redis connected'))
// .catch(console.error)

export default redisClient

