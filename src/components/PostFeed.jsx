"use client"
import config from '@/config/config';
import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useRef } from 'react'
import Post from './Post';

const PostFeed = ({initialPosts, communityName}) => {
    const lastPostRef = useRef(null);
    const {ref,entry} = useIntersection({
        root: lastPostRef.current,
        threshold: 1
    })
    console.log(initialPosts)
    const {data, fetchNextPage, isFetchingNextPage} = useInfiniteQuery(
        ['infinitePosts'],
        async ([pageParam = 1])=>{
            let query = `/api/posts?limit=${config.INFINITE_SCROLL_PAGINATION_AMOUNT}&page=${pageParam}`
            if(!!communityName){
                query+=`&communityName=${communityName}`
            }
            const {data} = await axios.get(query);
            return data;
        },{
            getNextPageParam: (_,pages)=> {return pages.length + 1},
            initialData: {pages:[initialPosts], pageParams: [1]},
        }
    )

    const posts = data?.pages.flatMap((page) => page) ?? initialPosts
    const {data:session} = useSession();
    return (
    <ul  className='flex flex-col col-span-2 space-y-6 list-none'>
      {posts.map((post, index) => {
        const votesAmt = post.votes.reduce((acc, vote) =>{
            if(vote.type === 'UP') {return acc + 1}
            if(vote.type === 'DOWN') {return acc - 1}
            return acc;
        } ,0)
        const currentVote = post.votes.find((vote)=> vote.userId === session?.user?.id)
        
        if(index === posts.length - 1){
            return (
                <li key={post.id} ref={ref}>
                    <Post communityName={post.community.name} post={post} votesAmt={votesAmt} currentVote={currentVote}
                    comments={post.comments} commentAmt={post.comments?.length}/>
                </li>
            )
        }
        else{
            return (
                <li key={post.id}>
                    <Post communityName={post.community.name}  post={post} votesAmt={votesAmt} currentVote={currentVote}
                    comments={post.comments} commentAmt={post.comments?.length}/>
                </li>
                   
            )
        }

      })}
    </ul>
  )
}

export default PostFeed
