import { Redis } from "@upstash/redis";
import { logger } from './logger';
import config from "@/config/config";
require('server-only');

let redisClient;

if(global.cachedRedis){
    logger.info('Using cached redis client')
    redisClient = global.cachedRedis

}else{
    logger.info('Creating new redis client')
    redisClient =  Redis.fromEnv();
    global.cachedRedis = redisClient
}


export const redis = redisClient;


export const redisHelpers ={
    setStringData: async (key, value) => {
        logger.info(`Setting redis key ${key} to ${value}`)
        const response =await redis.set(key, JSON.stringify(value))
        const ttl = await redis.expire(key, config.REDIS_TTL)
        return {response, ttl}
    },
    getStringData: async (key) => {
        logger.info(`Getting redis key ${key}`)
        const response = await redis.get(key)
        return response
    },
    deleteStringData: async (key) => {
        logger.info(`Deleting redis key ${key}`)
        const response = await redis.del(key)
        return response
    },
    setPostData: async ( post) => {
        logger.info(`Setting redis key post:${post}`)
        if(!post){
            return {response: null, ttl: null}
        }

        const postPayload = {authorUsername: post?.author.username, content: post.content,id:post.id,title: post.title, createdAt:post.createdAt }
        const response = await redis.set(`post:${post.id}`, JSON.stringify(postPayload))
        const ttl = await redis.expire(`post:${postID}`, config.REDIS_TTL)
        return {response, ttl}
    }
}



// import { createClient } from 'redis';
// import { logger } from './logger';

// export const redis = await createClient({
//     password: process.env.REDIS_ORG_SERET,
//     socket: {
//         host: process.env.REDIS_ORG_URL,
//         port: 15612
//     }
// }).on('error', err => logger.error('Redis Client Error', err))
//   .connect().then(() => logger.info('Redis Client Connected'))

  