import React, { Suspense } from 'react'
import { redis } from '@/lib/redis'
import { redisHelpers } from '@/lib/redisHelpers'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react'
import PostVoteServer from '@/components/post-vote/PostVoteServer'
import { buttonVariants } from '@/components/ui/button'
import { UserHoverCard } from '@/components/hover-card/UserHoverCard'
import { formatTimeToNow, wait } from '@/lib/utils'
import EditorOutput from '@/components/EditorOutput'
import { Skeleton } from '@/components/ui/skeleton'
import Comment from '@/components/comments/Comment'
import CommentsSection from '@/components/comments/CommentsSection'
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
  else {
    post = cachedPost
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

        <div className="sm:w-0 w-full flex-1 bg-white p-4 rounded-sm dark:bg-zinc-800 dark:text-white">

          <span className="text-gray-900 dark:text-zinc-300 max-h-40 mt-1 truncate text-xs">
            <a href={`/u/${post.author.username}`} className="text-blue-800 dark:text-zinc-300">
              Posted by u/<Suspense fallback={<span className='animate-pulse'>...</span>}>
                <UserHoverCard user={post.author} />
              </Suspense>
            </a>
            {'  '}
            {`(${formatTimeToNow(new Date(post.createdAt))})`}
          </span>

          <h1 className="font-semibold text-xl py-2 leading-6 text-gray-900 dark:text-white">
            {post.title}
          </h1>
          <EditorOutput content={post.content} />

          <Suspense fallback={
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          }>
              <CommentsSection postId={post.id}/>
          </Suspense>

        </div>


      </div>
    </div>
  )
}

function PostVoteShell() {
  return <div className=' flex items-center flex-row sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0'>
    <div className={buttonVariants({ variant: 'ghost' })}>
      <ArrowBigUp className='w-5 h-5 text-zinc-700 dark:text-zinc-300 animate-pulse rounded-md bg-primary/10' />
    </div>
    <div className="text-center py-2 font-medium text-sm text-zinc-900 dark:text-zinc-300">
      <Skeleton className='w-5 h-5 ' />
    </div>
    <div className={buttonVariants({ variant: 'ghost' })}>
      <ArrowBigDown className='w-5 h-5 text-zinc-700 dark:text-zinc-300 animate-pulse rounded-md bg-primary/10' />
    </div>



  </div>
}


export default page
