"use client"
import config from '@/config/config';
import { useIntersection } from '@mantine/hooks'
import { useSession } from 'next-auth/react';
import React, { Suspense, useEffect, useRef } from 'react'
import { Frown, Loader2, Meh } from 'lucide-react';
import dynamic from 'next/dynamic';
const Post = dynamic(() => import('../Post'), { ssr: false })
// TODO: Implement infinite scroll
const ProfileFeed = ({ initialPosts, communityName, username }) => {
  const lastPostRef = useRef(null)
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  })
  const { data: session } = useSession()


  const posts =  initialPosts?.length > 0 ? initialPosts : []

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
              
            })}

          </ul>
      
    </>
  )
}

export default ProfileFeed


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