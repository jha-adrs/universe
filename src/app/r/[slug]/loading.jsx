import React from 'react'
import CommunityHeaderSkeleton from '@/components/skeletons/CommunityHeaderSkeleton'
import FeedSkeleton from '@/components/skeletons/FeedSkeleton'

const Loading = () => {
  return (
    <div className="flex flex-col space-y-6">
      <CommunityHeaderSkeleton />
      <FeedSkeleton />
    </div>
  )
}

export default Loading
