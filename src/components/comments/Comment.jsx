"use client"
import React, { useRef } from 'react'
import UserAvatar from '../UserAvatar'
import { UserHoverCard } from '../hover-card/UserHoverCard'
import { formatTimeToNow } from '@/lib/utils'
// Will open a modal to add or edit a comment
const Comment = ({ comment, author, ...props }) => {
    const commentRef = useRef(null)
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
    </div>
}

export default Comment;
