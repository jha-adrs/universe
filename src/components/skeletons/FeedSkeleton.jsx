import React from 'react'
import config from '@/config/config'
import { Skeleton } from '../ui/skeleton'
import PostSkeleton from './PostSkeleton'
const FeedSkeleton = () => {
const postCount = config.INFINITE_SCROLL_PAGINATION_AMOUNT
  return (
    <ul className='flex flex-col col-span-2 space-y-6'>
         <PostSkeleton count={postCount} />
      </ul>
  )
}



export default FeedSkeleton
