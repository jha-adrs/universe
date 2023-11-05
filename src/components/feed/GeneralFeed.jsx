import config from '@/config/config'
import { db } from '@/lib/db'
import React from 'react'
import PostFeed from '../PostFeed'

const GeneralFeed =async () => {

    const posts = await db.post.findMany({
        orderBy:{
            createdAt: 'desc'
        },
        where:{
            visibility: 'PUBLIC'
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

export default GeneralFeed
