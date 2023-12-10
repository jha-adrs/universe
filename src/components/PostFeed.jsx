"use client"
import config from '@/config/config';
import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { Suspense, useEffect, useRef } from 'react'
import { Frown, Loader2, Meh } from 'lucide-react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import FeedSkeleton from './skeletons/FeedSkeleton';
const Post = dynamic(() => import('./Post'), { ssr: false })

const PostFeed = ({ initialPosts, communityName, username }) => {
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
        (!!communityName ? `&communityName=${communityName}` : '') + (!!username ? `&username=${username}` : '')

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
    <>
      
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

              if (index === posts.length - 1 && posts.length > 1 && posts.length > config.INFINITE_SCROLL_PAGINATION_AMOUNT ) {
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
      
    </>
  )
}

export default PostFeed


const NoPosts = () => {
  return (
    <div className='rounded-md bg-white shadow dark:bg-zinc-800 dark:text-white'>
      <div className="px-4 py-3 flex flex-col sm:flex-row">
        <div className="flex-1 mt-3 sm:mt-0">
          <div className="text-xs text-gray-500 dark:bg-zinc-800 dark:text-white">
            <span className="flex flex-col justify-center items-center text-gray-900 dark:bg-zinc-800 dark:text-white">
              <Frown className='h-6 w-6 text-gray-500 dark:text-gray-400' />
              <h1 className="text-lg font-semibold py-2 leading-6  dark:bg-zinc-800  text-gray-500 dark:text-gray-400">
                No posts yet.
              </h1>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}