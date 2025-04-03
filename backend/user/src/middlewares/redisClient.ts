import { createClient } from "redis";
import { config } from "dotenv";

config()

// console.log('Redis URL:', process.env.REDIS_CONNECTION_STRING!); // Debug line

// const redisClient =  createClient({ url: process.env.REDIS_CONNECTION_STRING!})

// Parse the Azure Cache for Redis connection string
const connectionString = process.env.REDIS_CONNECTION_STRING;
if (!connectionString) {
  throw new Error('REDIS_CONNECTION_STRING is not defined');
}

// Extract host, port, and password from the connection string
const [hostPort, params] = connectionString.split(',');
const [host, port] = hostPort.split(':');
const passwordMatch = params.match(/password=([^,]+)/);
const password = passwordMatch ? passwordMatch[1] : undefined;

// Construct the Redis URL in the format rediss://[username:password@]host:port
const redisUrl = `rediss://${password ? `:${password}@` : ''}${host}:${port}`;

const redisClient = createClient({
  url: redisUrl,
  // Optionally, you can explicitly enable SSL (though rediss:// implies it)
  socket: {
    tls: true,
    rejectUnauthorized: false // Use with caution; ideally, provide proper certificates
  }
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.connect()
.then(()=>console.log('redis connected'))
.catch(console.error)

export default redisClient
