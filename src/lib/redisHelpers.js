import {redis} from './redis'
import {logger} from './logger'
import config from '@/config/config'
export const redisHelpers ={
    setStringData: async (key, value) => {
        logger.info("Setting redis key", key, value)
        const response =await redis.set(key, JSON.stringify(value),"EX", config.REDIS_TTL)
        //const ttl = await redis.expire(key, config.REDIS_TTL)
        return response
    },
    getStringData: async (key) => {
        logger.info("Getting redis key",key)
        const response = await redis.get(key)
        return response
    },
    deleteStringData: async (key) => {
        logger.info("Deleting redis key ",key)
        const response = await redis.del(key)
        return response
    },
    setPostData: async ( post) => {
        logger.info("Setting redis key post", post)
        if(!post){
            return {response: null}
        }

        const postPayload = {authorUsername: post?.author.username, content: post.content,id:post.id,title: post.title, createdAt:post.createdAt }
        const response = await redis.set(`post:${post.id}`, JSON.stringify(postPayload), {ex: config.REDIS_TTL})
        //const ttl = await redis.expire(`post:${post.id}`, config.REDIS_TTL)
        return response
    }
}