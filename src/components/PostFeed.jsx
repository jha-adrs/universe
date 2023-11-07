"use client"
import config from '@/config/config';
import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import dynamic from 'next/dynamic';
const Post = dynamic(() => import('./Post'), { ssr: false })

const PostFeed = ({ initialPosts, communityName }) => {
    const lastPostRef = useRef(null)
    const { ref, entry } = useIntersection({
      root: lastPostRef.current,
      threshold: 1,
    })
    const { data: session } = useSession()
  
    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
      ['infinite-query'],
      async ({ pageParam = 1 }) => {
        const query =
          `/api/posts?limit=${config.INFINITE_SCROLL_PAGINATION_AMOUNT}&page=${pageParam}` +
          (!!communityName ? `&communityName=${communityName}` : '')
  
        const { data } = await axios.get(query)
        return data
      },
  
      {
        getNextPageParam: (_, pages) => {
          return pages.length + 1
        },
        initialData: { pages: [initialPosts], pageParams: [1] },
      }
    )
  
    useEffect(() => {
      if (entry?.isIntersecting && !isFetchingNextPage) {
        fetchNextPage() // Load more posts when the last post comes into view
      }
    }, [entry, fetchNextPage])
  
    const posts = data?.pages.flatMap((page) => page) ?? initialPosts
  
    return (
      <ul className='flex flex-col col-span-2 space-y-6'>
        {posts.map((post, index) => {
          const votesAmt = post.votes.reduce((acc, vote) => {
            if (vote.type === 'UP') return acc + 1
            if (vote.type === 'DOWN') return acc - 1
            return acc
          }, 0)
  
          const currentVote = post.votes.find(
            (vote) => vote.userId === session?.user.id
          )
  
          if (index === posts.length - 1) {
            // Add a ref to the last post in the list
            return (
              <li key={post.id} ref={ref}>
                <Post
                  post={post}
                  commentAmt={post.comments.length}
                  communityName={post.community.name}
                  votesAmt={votesAmt}
                  currentVote={currentVote}
                />
              </li>
            )
          } else {
            return (
              <Post
                key={post.id}
                post={post}
                commentAmt={post.comments.length}
                communityName={post.community.name}
                votesAmt={votesAmt}
                currentVote={currentVote}
              />
            )
          }
        })}
  
        {isFetchingNextPage && (
          <li className='flex justify-center'>
            <Loader2 className='w-6 h-6 text-zinc-500 animate-spin' />
          </li>
        )}
      </ul>
    )
  }
  
  export default PostFeed