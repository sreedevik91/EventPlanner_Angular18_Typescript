import { createClient } from "redis";

const redisClient =  createClient({ url: 'redis://localhost:6379' })

redisClient.connect()
.then(()=>console.log('redis connected'))
.catch(console.error)

export default redisClient