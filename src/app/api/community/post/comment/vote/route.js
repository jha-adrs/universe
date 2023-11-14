import config from "@/config/config"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"
import { redis } from "@/lib/redis"
import { CommentVoteValidator } from "@/lib/validators/vote"
import { z } from "zod"
export async function PATCH(req) {
    try {
        logger.info("PATCH /api/community/post/comment/vote")
        
        const body = await req.json()
        const { commentId, voteType } = CommentVoteValidator.parse(body)
        const session = await getAuthSession(req)
        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }
        const existingVote = await db.commentVote.findFirst({
            where: {
                userId: session.user.id,
                commentId
            }

        })
        // TODO: Add function to increase user karma on upvote
        const comment = await db.comment.findUnique({
            where: {
                id: commentId
            },
            include: {
                author: true,
                votes: true,
            }

        })


        if (!comment) {
            logger.error('comment not found')
            return new Response('comment not found', { status: 404 })
        }
        if (existingVote) {
            if (existingVote.type === voteType) {
                logger.info('Vote type is the same, removing vote')
                await db.commentVote.delete({
                    where: {
                        userId_commentId: {
                            userId: session.user.id,
                            commentId

                        }
                    }
                })
                return new Response('Vote removed', { status: 200 })
            }
            await db.commentVote.update({
                where: {
                    userId_commentId: {
                        userId: session.user.id,
                        commentId
                    }
                },
                data: {
                    type: voteType
                }
            })
            const votesAmt = await comment.votes.reduce((acc, vote) => {
                if (vote.type === 'UP') {
                    return acc + 1
                }
                if (vote.type === 'DOWN') {
                    return acc - 1
                }
                return acc
            }, 0)
            logger.info(votesAmt, "votesAmt", comment.votes)
            
            return new Response('Vote updated', { status: 200 })

        }
        else {
            await db.commentVote.create({
                data: {
                    type: voteType,
                    userId: session.user.id,
                    commentId
                }
            })
            const votesAmt = comment.votes.reduce((acc, vote) => {
                if (vote.type === 'UP') {
                    return acc + 1
                }
                if (vote.type === 'DOWN') {
                    return acc - 1
                }
                return acc
            }, 0)
            
            return new Response('Vote created', { status: 200 })
        }
    } catch (error) {
        logger.error(error)

        if (error instanceof z.ZodError) {
            return new Response('Invalid Comment request', { status: 422 })
        }
        return new Response('Something went wrong!', { status: 500 })
    }
}