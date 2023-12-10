import FeedSkeleton from '@/components/skeletons/FeedSkeleton'
import React from 'react'

const Loading = () => {
  return (
    <main className="">
      <h1 className="font-bold text-3xl md:text-4xl">
        Your feed
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
        {/*Feed */}
        
        {/*Widgets */}
        {/* SubbredditCluster Info */}
        <FeedSkeleton />
      </div>

    </main>
  )
}

export default Loading
