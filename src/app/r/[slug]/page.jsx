import MiniCreatePost from '@/components/MiniCreatePost';
import PostFeed from '@/components/PostFeed';
import FeedSkeleton from '@/components/skeletons/FeedSkeleton';
import config from '@/config/config';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'

const page = async ({params}) => {
    const { slug } = params;
    const session = await getAuthSession();

    const community = await db.community.findFirst({
        where: {name: slug},
        include:{
            posts:{
                orderBy:{
                    createdAt: 'desc'
                },
                include:{
                    author:true,
                    votes:true,
                    comments: true,
                    community:true
                },
                take: config.INFINITE_SCROLL_PAGINATION_AMOUNT,
            }
        }
    });

    if(!community){
        return notFound();
    }

  return (
    <>
        <h1 className="font-bold text-3xl md:text-4xl h-14">
            r/{community.name}
        </h1>
        <MiniCreatePost session={session}/>
        <PostFeed initialPosts={community.posts} communityName={community.name}/>
       
        
    </>
  )
}

export default page
