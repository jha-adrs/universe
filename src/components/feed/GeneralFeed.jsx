import config from '@/config/config'
import { db } from '@/lib/db'
import React, { Suspense } from 'react'
import PostFeed from '../PostFeed'
import FeedSkeleton from '../skeletons/FeedSkeleton'

const GeneralFeed = async () => {

    const posts = await db.post.findMany({
        orderBy: [
            { createdAt: 'desc' },
        ],
        where: {
            visibility: 'PUBLIC'
        },
        include: {
            community: true,
            author: true,
            votes: true,
            comments: true,

        },
        take: config.INFINITE_SCROLL_PAGINATION_AMOUNT
    })
    return (
        <Suspense fallback={<FeedSkeleton/>}>
            <PostFeed initialPosts={posts} />
        </Suspense>

    )
}

export default GeneralFeed
