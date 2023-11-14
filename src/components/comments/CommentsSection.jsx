import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import React from 'react'
import Comment from './Comment'
import CreateComment from './CreateComment'
import notFound from 'next/navigation'
const CommentsSection = async ({ postId }) => {
    if (!postId) return notFound()
    const session = await getAuthSession()
    // only the top level comments are included
    const comments = await db.comment.findMany({
        where: {
            postId,
            replyToId: null
        },
        include: {
            author: true,
            votes: true,
            replies: {
                include: {
                    author: true,
                    votes: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const filteredComments = comments.filter((comment) => !comment.replyToId)
        .map((topLevelComment) => {
            const topLevelCommentVotesAmt = topLevelComment?.votes.reduce((acc, vote) => {
                if (vote.type === 'UP') return acc + 1
                if (vote.type === 'DOWN') return acc - 1
                return acc
            }, 0)

            const topLevelCommentVote = topLevelComment.votes.find(
                (vote) => vote.userId === session?.user.id
            )
            return (
                <div key={topLevelComment?.id} className='flex flex-col'>
                    <div className="mb-2">
                        <Comment comment={topLevelComment} postId={postId} currentVote={topLevelCommentVote} votesAmt={topLevelCommentVotesAmt}  />
                    </div>
                    {/*Replies */}
                    {topLevelComment.replies?.sort(
                        (a,b)=> b.votes.length - a.votes.length
                        ).map((reply) => {
                            const secondLevelCommentVotesAmt = reply?.votes.reduce((acc, vote) => {
                                if (vote.type === 'UP') return acc + 1
                                if (vote.type === 'DOWN') return acc - 1
                                return acc
                            }, 0)
                
                            const secondLevelCommentVote = reply.votes.find(
                                (vote) => vote.userId === session?.user.id
                            )
                            return (
                                <div key={reply?.id} className='ml-2 py-2 pl-4 border-l-2 border-zinc-200  '>
                                    <div className="mb-2">
                                        <Comment comment={reply} postId={postId} currentVote={secondLevelCommentVote} votesAmt={secondLevelCommentVotesAmt}  isCommentReply={true} />
                                    </div>
                                </div>
                            )

                        })
                    }
                </div>
            )

        })
    return (
        <div className='flex flex-col gap-y-4 mt-4 '>
            <hr className='w-full h-px my-6' />

            <CreateComment postId={postId} user = {session?.user} />
            <h3 className='font-semibold'>
                Post Comments
            </h3>
            <div className='flex flex-col gap-y-6 mt-4'>
                {filteredComments}
            </div>
        </div>
    )
}

export default CommentsSection
