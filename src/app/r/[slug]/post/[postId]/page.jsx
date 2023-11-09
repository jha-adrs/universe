import React from 'react'
import {redis } from '@/lib/redis'
import { redisHelpers } from '@/lib/redisHelpers'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const page = async({params}) => {
  const {postId} = params
  const cachedPost = await redis.get(`post:${postId}`)
  console.log(cachedPost, "found in cache")
  let post;
  if(!cachedPost) {
    post = await db.post.findFirst({
      where:{
        id: postId
      },
      include: {
        community: true,
        votes: true,
        author:true,
        comments:true,
      }
    })
    await redisHelpers.setPostData(post)

  }
  if(!cachedPost && !post){
    return notFound()
  }

  return (
    <div>
      Post {postId}{post?.title}
    </div>
  )
}

export default page
