import CommunityAvatar from '@/components/CommunityAvatar';
import MiniCreatePost from '@/components/MiniCreatePost';
import SubscribeLeaveToggle from '@/components/SubscribeLeaveToggle';
import FeedSkeleton from '@/components/skeletons/FeedSkeleton';
import config from '@/config/config';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import React, { Suspense, lazy } from 'react'

// Lazy load the PostFeed component
const PostFeed = lazy(() => import('@/components/PostFeed'));

const page = async ({ params }) => {
    const { slug } = params;
    const session = await getAuthSession();

    const community = await db.community.findFirst({
        where: { name: slug },
        include: {
            posts: {
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    author: true,
                    votes: true,
                    comments: true,
                    community: true
                },
                take: config.INFINITE_SCROLL_PAGINATION_AMOUNT,
            }
        }
    });

    if (!community) {
        return notFound();
    }

    return (
        <>
            <Suspense fallback={<FeedSkeleton />}>
                <div className='w-full h-fit p-3 items-center justify-between  inline-flex overflow-hidden rounded-md bg-white shadow list-none dark:bg-zinc-800 dark:text-white'>
                    <div className='inline-flex items-center gap-x-4 '>
                        <CommunityAvatar community={community} className="w-10 h-10" />

                        <p className="font-bold text-2xl md:text-3xl h-10">
                            r/{community.name}
                        </p>
                    </div>

                    <SubscribeLeaveToggle communityId={community.id} subscriptionStatus={community.subscriptionStatus} className="w-fit " />


                </div>
                <MiniCreatePost session={session} />
                <PostFeed initialPosts={community.posts} communityName={community.name} />

            </Suspense>

        </>
    )
}

export default page
