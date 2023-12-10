
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DotsVerticalIcon } from "@radix-ui/react-icons"

import FeedSkeleton from "../skeletons/FeedSkeleton"


import { Skeleton } from '@/components/ui/skeleton'

const UserProfileSkeleton = () => {
  return (
    <div className="flex flex-col items-center h-full w-full">
      <div className="flex flex-row w-[70%] h-fit bg-zinc-100 dark:bg-zinc-950 rounded-lg items-center">

        <Card className="flex-col w-full h-full">
          <CardHeader>
            <div className="relative w-full inline-flex h-36 rounded-t-md overflow-hidden">
              <Skeleton className="rounded-t-lg  w-full h-full" />

            </div>

          </CardHeader>
          <CardContent className="flex flex-row space-y-2">
            <div className=" relative gap-x-4 h-12 ml-2">
              <Skeleton className='rounded-full w-12 h-12 ' />
            </div>
            <div className="flex flex-row ml-4 w-full justify-between  overflow-hidden">
              <div className="flex flex-col h-fit w-[70%] gap-y-2 mr-4 overflow-hidden ">
                <Skeleton className="font-bold text-xl dark:text-white w-40 h-5" />
                <Skeleton className="text-sm text-gray-500 dark:text-gray-400  w-36 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
      <div className='flex flex-row w-[70%] bg-zinc-100 dark:bg-zinc-950 rounded-lg items-center mt-4 h-full'>
        <div className="flex w-full h-full items-center justify-center">
          <Card className="flex-col w-full h-full">
            <CardHeader>
              <CardTitle>
              <Skeleton className='rounded-lg w-12 h-5 ' />
              </CardTitle>
              <CardDescription>
                <Skeleton className="w-48 h-5 " />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-col w-full h-full rounded-t-lg  ">
                <FeedSkeleton />
              </div>
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default UserProfileSkeleton
