import config from '@/config/config'
import { db } from '@/lib/db'
import React from 'react'
import PostFeed from '../PostFeed'
import { getAuthSession } from '@/lib/auth'

const CustomFeed = async () => {
  const session  = await getAuthSession()
    //const followedCommunities = await db.$queryRaw`SELECT * FROM Subscription WHERE userId = ${session?.user.id}`
    const followedCommunities = await db.subscription.findMany({
        where:{
            userId: session?.user.id
        },
        include:{
            community: true
        }
    })
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

  return (<>
    <PostFeed initialPosts={posts} />
    </>
    
 
  )
}

export default CustomFeed
