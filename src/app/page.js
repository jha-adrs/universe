import('server-only')
import CommunityAvatar from '@/components/CommunityAvatar'
import PostFeed from '@/components/PostFeed'
import CustomFeed from '@/components/feed/CustomFeed'
import GeneralFeed from '@/components/feed/GeneralFeed'
import { buttonVariants } from '@/components/ui/button'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { cn } from '@/lib/utils'
import { Compass, HomeIcon, PenBox, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export default async function Home() {
  const session = await getAuthSession()
  // Get top communities
  const topCommunities = await db.community.findMany({
    take: 5,
    orderBy: {
      members: {
        _count: 'desc'

      }
    }, select: {
      id: true,
      name: true,
    }

  });
  logger.info(typeof topCommunities, topCommunities)


  return (
    <main className="">
      <h1 className="font-bold text-3xl md:text-4xl">
        Your feed
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
        {/*Feed */}
        {session ? (<CustomFeed session={session?.user} />) : (<GeneralFeed />)}
        {/*Widgets */}
        {/* SubbredditCluster Info */}


        <div className="overflow-hidden   order-first md:order-last">
          <div className="mb-4 rounded-lg">
            <div className='h-fit rounded-lg border border-gray-200'>
              <div className='bg-gray-200 dark:bg-zinc-800 dark:text-white  px-6 py-4'>
                <p className="font-semibold py-3 flex items-center gap-1.5">
                  <Users className='w-4 h-4' />
                  Popular Communities
                </p>
              </div>

              <div className="my-3  px-6 py-0 text-sm leading-6 ">
                <div className="flex justify-between gap-x-4 py-3">
                  <p className="text-zinc-600 dark:text-zinc-300">
                    Communities you may be interested in.
                  </p>
                </div>
                <div className="flex flex-col w-full  gap-x-4 items-center h-[70%]">
                  {topCommunities.map((community) => (
                    <CommunityListItem key={community.id} community={community} name={community.name} />
                  ))}
                </div>

                <Link className={buttonVariants({ className: 'w-full mt-4 mb-6 ', variant: "black" })} href='/popular'>
                  <Compass className='w-4 h-4 mr-2' /> Explore</Link>

              </div>

            </div>
          </div>
          <div className='h-fit rounded-lg border border-gray-200'>
            <div className='bg-gray-200 dark:bg-zinc-800 dark:text-white  px-6 py-4'>
              <p className="font-semibold py-3 flex items-center gap-1.5">
                <HomeIcon className='w-4 h-4' />
                Start your journey
              </p>
            </div>

            <div className="my-3  px-6 py-4 text-sm leading-6 ">
              <div className="flex justify-between gap-x-4 py-3">
                <p className="text-zinc-600 dark:text-zinc-300">Create your space with people with similar interests</p>
              </div>

              <Link className={buttonVariants({ className: 'w-full mt-4 mb-6 ', variant: "black" })} href='/r/create'>
                <PenBox className='w-4 h-4 mr-2' /> Create Community</Link>

            </div>

          </div>


        </div>

        {/**Secondary Widget */}

      </div>

    </main>
  )
}

const CommunityListItem = ({ community, name }) => {
  if (!name) return null;
  return (

    <Link href={`/r/${community.name}`} key={community.id} className="w-full h-12 justify-center items-start ">
      <div className={buttonVariants({ variant: "outline", className: "w-full h-12 justify-center items-start " })}>
        <div className="items-center justify-start  inline-flex w-full">
          <CommunityAvatar community={community} className="w-5 h-5 rounded-full mr-2" /> r/{name}
        </div>
      </div>
    </Link>
  )
}