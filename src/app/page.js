import PostFeed from '@/components/PostFeed'
import CustomFeed from '@/components/feed/CustomFeed'
import GeneralFeed from '@/components/feed/GeneralFeed'
import { buttonVariants } from '@/components/ui/button'
import { getAuthSession } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { HomeIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  const session = await getAuthSession()
  return (
    <main className="">
      <h1 className="font-bold text-3xl md:text-4xl">
        Your feed
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
        {/*Feed */}
        {session ? (<CustomFeed session={session?.user}/>):(<GeneralFeed/>)}
        {/*Widgets */}
        {/* SubbredditCluster Info */}

        <div className="overflow-hidden h-fit rounded-lg border border-gray-200  order-first md:order-last">
          <div className='bg-emerald-200 dark:bg-accent px-6 py-4'>
            <p className="font-semibold py-3 flex items-center gap-1.5">
              <HomeIcon className='w-4 h-4' />
              Home
            </p>
          </div>

          <div className="my-3 divide-y px-6 py-4 text-sm leading-6 ">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-600">Your customized personal feed, based on communities you follow.</p>
            </div>

            <Link className={buttonVariants({className:'w-full mt-4 mb-6 ', variant:"black"})} href='/r/create'>
              Create Community</Link>

          </div>
        </div>
      </div>

    </main>
  )
}
