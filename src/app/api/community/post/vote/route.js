import config from "@/config/config"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"
import { redis } from "@/lib/redis"
import { PostVoteValidator } from "@/lib/validators/vote"
import { z } from "zod"

export async function PATCH(req){
    try {
        logger.info("PATCH /api/community/post/vote")
        const body = await req.json()
        const {postId,voteType} = PostVoteValidator.parse(body)
        const session = await getAuthSession(req)
        if(!session?.user){
            return new Response('Unauthorized', {status:401})
        }
        const existingVote = await db.vote.findFirst({
            where:{
                userId: session.user.id,
                postId
            }

        })
        // TODO: Add function to increase user karma on upvote
        const post = await db.post.findUnique({
            where:{
                id:postId
            },
            include:{
                author: true,
                votes:true
            }
        
        })
        logger.debug(post, "post")

        if(!post){
            logger.error('Post not found')
            return new Response('Post not found', {status:404})
        }
        if(existingVote){
            if(existingVote.voteType === voteType){
                logger.debug('Vote type is the same, removing vote')
                await db.vote.delete({
                    where:{
                        userId_postId:{
                            userId: session.user.id,
                            postId
                        
                        }
                    }
                })
                return new Response('Vote removed', {status:200})
            }
            await db.vote.update({
                where:{
                    userId_postId:{
                        userId: session.user.id,
                        postId
                    }
                },
                data:{
                    type:voteType
                }
            })
            const votesAmt = await post.votes.reduce((acc, vote) => {
                if(vote.voteType === 'UP'){
                    return acc + 1
                }
                if(vote.voteType === 'DOWN'){
                    return acc - 1
                }
                return acc
            },0)
            if(votesAmt >= config.VOTE_THRESHOLD){
                const cachePayload  = {
                    authorUsername: post.author.username ?? '',
                    content: JSON.stringify(post.content),
                    id: post.id,
                    title: post.title,
                    currentVote: voteType,
                    createdAt: post.createdAt
                }
                const cacheResponse = await redis.hset(`post:${postId}`, cachePayload)
                console.log(cacheResponse, "cache change1")
            }
            if(votesAmt < config.NEGATIVE_VOTE_THRESHOLD){
                const cachePayload = {

                }
                logger.debug('Post has reached negative vote threshold, deleting post')
                // TODO: Add function to decrease user karma on downvote
                // TODO: Add function to delete post on downvote
            }
            return new Response('Vote updated', {status:200})

        }
        else{
            await db.vote.create({
                data:{
                    type: voteType,
                    userId: session.user.id,
                    postId
                }
            })
            const votesAmt = post.votes.reduce((acc, vote) => {
                if(vote.voteType === 'UP'){
                    return acc + 1
                }
                if(vote.voteType === 'DOWN'){
                    return acc - 1
                }
                return acc
            },0)
            console.log(votesAmt, "votesAmt")
            if(votesAmt >= config.VOTE_THRESHOLD){
                const cachePayload = {
                    authorUsername: post.author.username ?? '',
                    content: JSON.stringify(post.content),
                    id: post.id,
                    title: post.title,
                    currentVote: voteType,
                    createdAt: post.createdAt
                }
               const cacheResponse = await redis.hset(`post:${postId}`, cachePayload)
                console.log(cacheResponse, "cache change2")
            }
            if(votesAmt < config.NEGATIVE_VOTE_THRESHOLD){
                const cachePayload = {

                }
            }
            return new Response('Vote created', {status:200})
        }
    } catch (error) {
        logger.error(error)

        if( error instanceof z.ZodError){
            return new Response('Invalid POST request', {status:422})
        }
        return new Response('Something went wrong!', {status:500})
    }
}