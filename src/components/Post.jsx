"use client"
import { formatTimeToNow } from '@/lib/utils'
import { ArrowBigUp, ArrowUp01Icon, ArrowUpNarrowWide, DotIcon, Heart, MessageCircleIcon, MessageSquare } from 'lucide-react'
import React, { useRef } from 'react'

import dynamic from 'next/dynamic';
import { UserHoverCard } from './hover-card/UserHoverCard';
const PostVoteClient = dynamic(() => import('./post-vote/PostVoteClient'), { ssr: false })
const EditorOutput = dynamic(() => import('./EditorOutput'), { ssr: false })


const Post = ({communityName, post, votesAmt, currentVote, commentAmt, ...props}) => {
    const pRef = useRef(null);
    
    return (
        <div className='rounded-md bg-white shadow '>
            <div className="px-4 py-3 flex flex-col sm:flex-row">
                <PostVoteClient postId={post.id} initialVotesAmt={votesAmt} initialVote={currentVote} />
                <div className="flex-1 mt-3 sm:mt-0">
                    <div className="text-xs text-gray-500">
                        {communityName && (
                            <a href={`/r/${communityName}`} className='underline text-zinc-900 text-sm underline-offset-2'>
                                r/{communityName}
                            </a>
                        )}
                        <span className="px-1"></span>
                        <span className="text-gray-900">
                            <a href={`/u/${post.author.username}`} className="text-blue-800">
                                Posted by u/<UserHoverCard user={post.author} />
                            </a>
                            {'  '}
                            {`(${formatTimeToNow(new Date(post.createdAt))})`}
                        </span>
                    </div>

                    <a href={`/r/${communityName}/post/${post.id}`}>
                        <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
                            {post.title}
                        </h1>
                    </a>

                    <div className='relative text-sm max-h-40 overflow-clip' ref={pRef}>
                        <EditorOutput content={post.content}/>
                        {pRef.current?.clientHeight === 200 && (
                            <div className="absolute bottom-0 left-0 h-35 w-full bg-gradient-to-t from-white to-transparent"/>
                        )}
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 z-20 p-3 sm:px-4">
                <a href={`/r/${communityName}/post/${post.id}`} className='flex items-center gap-2 text-xs'>
                    <MessageSquare  className='h-4 w-4'/> {commentAmt}{' '}comments
                </a>
            </div>
        </div>
    );
}

export default Post;