
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader, Loader2 } from 'lucide-react'

const UserProfileSkeleton = () => {
  return (
    <div className="flex items-center space-x-4">
      <Loader2 className='animate-spin' size={64} />
    </div>
  )
}

export default UserProfileSkeleton
