import React, { Suspense } from 'react'
import { redis } from '@/lib/redis'
import { redisHelpers } from '@/lib/redisHelpers'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react'
import PostVoteServer from '@/components/post-vote/PostVoteServer'
import { buttonVariants } from '@/components/ui/button'
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const page = async ({ params }) => {
  const { postId } = params
  const cachedPost = await redisHelpers.getPostData(postId)
  console.log("Found in cache", postId)
  let post;
  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: postId
      },
      include: {
        community: true,
        votes: true,
        author: true,
        comments: true,
      }
    })
    await redisHelpers.setPostData(post)

  }
  if (!cachedPost && !post) {
    return notFound()
  }

  async function getDataFunction() {
    return await db.post.findFirst({
      where: {
        id: postId
      },
      include: {
        community: true,
        votes: true,
        author: true,
        comments: true,
      }
    })
  }

  return (
    <div>
      <div className='h-full flex flex-col sm:flex-row items-center sm:items-start justify-between'>
        <Suspense fallback={<PostVoteShell />}>
          <PostVoteServer
            postId={postId}
            getData={getDataFunction}
          />
        </Suspense> 
      </div>
    </div>
  )
}

function PostVoteShell() {
  return <div className='flex items-center flex-col pr-6 w-20'>
    <div className={buttonVariants({ variant: 'ghost' })}>
      <ArrowBigUp className='w-5 h-5 text-zinc-700 animate-pulse rounded-md bg-primary/10' />
    </div>
    <div className="text-center py-2 font-medium text-sm text-zinc-900">
      <Loader2 className='w-5 h-5 animate-spin' />
    </div>
    <div className={buttonVariants({ variant: 'ghost' })}>
      <ArrowBigDown className='w-5 h-5 text-zinc-700 animate-pulse rounded-md bg-primary/10' />
    </div>
    


  </div>
}


export default page
