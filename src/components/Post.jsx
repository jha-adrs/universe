
import { formatTimeToNow } from '@/lib/utils'
import { ArrowBigUp, ArrowUp01Icon, ArrowUpNarrowWide, DotIcon, Heart, MessageCircleIcon, MessageSquare } from 'lucide-react'
import React, { useRef } from 'react'
import EditorOutput from './EditorOutput';

const Post = ({communityName,post,voteAmt,currentVote,commentAmt, ...props}) => {
    const pRef = useRef(null);
  return (
    <div className='rounded-md bg-white shadow'>
        <div className="px-6 py-4 flex justify-between">

            <div className="w-0 flex-1">
                <div className="max-h-40 mt-1 text-xs text-gray-500">
                    {communityName?(<>
                    <a href={`/r/${communityName}`} className='underline text-zinc-900 text-sm underline-offset-2'>
                        r/{communityName}
                    </a>
                    <span className="px-1"></span>
                    </>): null}
                    <span className="text-gray-900">Posted by u/{post.author.name}</span>
                    {'  '}
                    {`(${formatTimeToNow(new Date(post.createdAt))})`}
                </div>

                <a href={`/r/${communityName}/post/${post.id}`}>
                    <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
                        {post.title}
                    </h1>
                </a>

                <div className='relative text-sm max-h-40 w-full overflow-clip' ref={pRef}>
                    <EditorOutput content={post.content}/>
                        {pRef.current?.clientHeight === 200 ? (
                            <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent"/>
                        ): null}
                </div>
            </div>
        </div>
        <div className="bg-gray-50 z-20 text-sm p-4 sm:px-6">
            <a href={`/r/${communityName}/post/${post.id}`}
            className='w-fit flex items-center gap-2'>
                <Heart className='h-4 w-4'/> {voteAmt || 0}
                <MessageSquare  className='h-4 w-4'/> {commentAmt}


            </a>
        </div>
    </div>
  )
}

export default Post