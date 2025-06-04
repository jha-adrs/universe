import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import CommunitiesDisplay from '@/components/CommunitiesDisplay'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function CommunitiesPage() {
  const session = await getAuthSession()
  
  if (!session?.user) {
    return redirect('/sign-in')
  }

  // Get user's subscribed communities
  const subscribedCommunities = await db.subscription.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      community: true,
    },
    orderBy: {
      dateJoined: 'desc',
    },
  })

  // Get popular communities
  const popularCommunities = await db.community.findMany({
    take: 5,
    orderBy: {
      members: {
        _count: 'desc'
      }
    },
    include: {
      _count: {
        select: {
          members: true,
          posts: true,
        },
      },
      members: {
        where: {
          userId: session.user.id,
        },
        select: {
          userId: true,
        },
      },
    },
  })

  const mappedSubscribed = subscribedCommunities.map(({ community }) => ({
    ...community,
    isSubscribed: true,
    memberCount: 0, // We'll get actual count from the DB
    postCount: 0,
  }))

  const mappedPopular = popularCommunities.map((community) => ({
    ...community,
    isSubscribed: community.members.length > 0,
    memberCount: community._count.members,
    postCount: community._count.posts,
  }))

  return (
    <div className="container max-w-7xl mx-auto py-8">
      <div className="grid grid-cols-1 gap-y-4 md:grid-cols-3 md:gap-x-4">
        <div className="col-span-3">
          <h1 className="font-bold text-3xl md:text-4xl mb-6">Your Communities</h1>
          <CommunitiesDisplay 
            subscribedCommunities={mappedSubscribed} 
            popularCommunities={mappedPopular}
            userId={session.user.id}
          />
        </div>
        
      </div>
    </div>
  )
}
