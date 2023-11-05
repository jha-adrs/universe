import config from '@/config/config'
import { db } from '@/lib/db'
import React from 'react'
import PostFeed from '../PostFeed'

const CustomFeed = async () => {

    const posts = await db.post.findMany({
        orderBy:{
            createdAt: 'desc'
        },
        include:{
            community: true,
            author: true,
            votes: true,
            comments: true,
            
        },
        take: config.INFINITE_SCROLL_PAGINATION_AMOUNT
    })

  return (
    <PostFeed initialPosts={posts} />
 
  )
}

export default CustomFeed
