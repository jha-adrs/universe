import { Redis } from "@upstash/redis";
import { logger } from './logger';
import config from "@/config/config";
require('server-only');
import https from 'https'
let redisClient;

if(redisClient){
    logger.info('Using cached redis client')
}else{
    logger.info('Creating new redis client')
    redisClient =  Redis.fromEnv({agent: new https.Agent({ keepAlive: true, timeout: 60000 })});
}


export const redis = redisClient;


// import { logger } from './logger';

// export const redis = await createClient({
//     password: process.env.REDIS_ORG_SERET,
//     socket: {
//         host: process.env.REDIS_ORG_URL,
//         port: 15612
//     }
// }).on('error', err => logger.error('Redis Client Error', err))
//   .connect().then(() => logger.info('Redis Client Connected'))

  