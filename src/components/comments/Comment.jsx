"use client"
import React, { useRef, useState } from 'react'
import UserAvatar from '../UserAvatar'
import { UserHoverCard } from '../hover-card/UserHoverCard'
import { formatTimeToNow } from '@/lib/utils'
import CommentVotes from './CommentVotes'
import { Button } from '@/components/ui/button'
import { Loader2, MessageSquare } from 'lucide-react'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { useSession } from 'next-auth/react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'
// Will open a modal to add or edit a comment
const Comment = ({ comment, author, votesAmt, postId, currentVote,isCommentReply, ...props }) => {
    const { loginToast } = useCustomToasts()
    const {toast} = useToast()
    const commentRef = useRef(null)
    const { data: session } = useSession()
    const [isReplying, setIsReplying] = useState(false)
    const [input, setInput] = useState('')

    const { mutate: createComment, isLoading } = useMutation({
        mutationFn: async ({ text, postId, replyToId }) => {
            const payload = { text, postId, replyToId }
            if (!session?.user) return loginToast()
            const { data } = await axios.patch(`/api/community/post/comment`, payload)
            return data;
        },
        onError: (err) => {
            return toast({
                title: 'Something went wrong.',
                description: "Your comment was not created. Please try again.",
                variant: 'destructive',
            })
        },
        onSuccess: (data) => {
            setInput('')
            setIsReplying(false)
            return toast({
                title: 'Success!',
                description: "Your comment was created.",
                variant: 'success',
            })
        }
    })


    return <div className='flex flex-col ' ref={commentRef}>
        <div className="flex items-center">
            <UserAvatar user={comment?.author} className='h-6 w-6 rounded-full' />
            <div className='ml-2 flex items-center gap-x-2'>
                <span className="text-gray-900 max-h-40 mt-1 truncate text-xs font-medium">
                    <a href={`/u/${comment?.author.username}`} className="text-blue-800">
                        u/ <UserHoverCard user={comment.author} />
                    </a>
                    {'  '}
                    {`(${formatTimeToNow(new Date(comment.createdAt))})`}
                </span>


            </div>
        </div>
        <p className="text-sm text-zinc-90 mt-2">
            {comment.text}
        </p>

        <div className="flex sm:flex-row gap-2 items-between justify-between flex-wrap" >
            <CommentVotes commentId={comment.id} initialVotesAmt={votesAmt} initialVote={currentVote} />

            <Button variant='ghost' size='xs' aria-label='reply' onClick={() => setIsReplying(true)}  >
                <MessageSquare className='h-4 w-4 mx-1.5' /> Reply
            </Button>
            {isReplying ?
                <div className='grid w-full gap-1.5'>
                    <Label >Your comment</Label>
                    <div className='grid w-full gap-1.5'>
                        <Label htmlFor='comment' className='text-sm font-medium text-gray-600'>
                            Comment as @{session?.user?.username}
                        </Label>
                        <div className="mt-2">
                            <Textarea
                                id="comment"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                rows={1}
                                placeholder='Your comment here'
                            />

                            <div className="mt-2 flex justify-end">
                                <Button variant='outline' className='mx-2' onClick={() => setIsReplying(false)}>
                                    Cancel
                                </Button>
                                <Button variant='black' onClick={() => {
                                    if (!input) return
                                    createComment({
                                        text: input,
                                        postId,
                                        replyToId: comment.replyToId ?? comment.id
                                    })
                                }} disabled={isLoading || input.length === 0}>
                                    {isLoading ? <Loader2 className='animate-spin' /> : 'Reply'}
                                </Button>
                            </div>
                        </div>
                    </div>

                </div> : null}
        </div>
    </div>
}

export default Comment;
