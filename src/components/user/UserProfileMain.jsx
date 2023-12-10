"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import UserAvatar from "../UserAvatar"
import { ImagePlus } from "lucide-react"
import { DotsVerticalIcon } from "@radix-ui/react-icons"
import Image from "next/image"
import PostFeed from "../PostFeed"
import { Suspense } from "react"
import FeedSkeleton from "../skeletons/FeedSkeleton"


export default function UserProfileMain({ data, username }) {
  console.log(data)
  return (
    <div className="flex flex-col items-center h-full w-full">
      <div className="flex flex-row w-[70%] h-fit bg-zinc-100 dark:bg-zinc-950 rounded-lg items-center">

        <Card className="flex-col w-full h-full">
          <CardHeader>
            <div className="relative w-full inline-flex h-36 rounded-t-md overflow-hidden">
              <Image className="rounded-t-lg" fill style={{ "object-fit": "cover" }} alt="Cover Image" src="https://utfs.io/f/b33605dd-87a3-48e8-bdc5-04e7026c203a-tbokdq.jpg" />
              <div className="absolute top-2 right-2 rounded-full w-6 h-6 dark:bg-gray-900/50 flex items-center justify-center hover:bg-gray-500 bg-gray-900 hover:dark:bg-gray-900">
                <ImagePlus className=' text-white/50 cursor-pointer' size={16} />
              </div>
            </div>

          </CardHeader>
          <CardContent className="flex flex-row space-y-2">
            <div className=" relative gap-x-4 h-12 ml-2">
              <UserAvatar user={data?.user} className='rounded-full w-12  ' />
              <div className="absolute -bottom-1 -right-1 rounded-full w-6 h-6 dark:bg-gray-900/50 flex items-center justify-center hover:bg-gray-900 bg-gray-500 hover:dark:bg-gray-900">
                <ImagePlus className=' text-white cursor-pointer' size={16} />
              </div>
            </div>
            <div className="flex flex-row ml-4 w-full justify-between  overflow-hidden">
              <div className="flex flex-col h-fit w-[70%] mr-4 overflow-hidden ">
                <div className="font-bold text-xl dark:text-white">{data?.user.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">u/{data?.user.username}</div>
              </div>
              <div className="w-8 flex my-2 mr-2 flex-col justify-start items-start">
                <Button variant="ghost" className="hover:bg-accent w-6 p-0">
                  <DotsVerticalIcon className=" text-black dark:text-gray-400" size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
      <div className='flex flex-row w-[70%] bg-zinc-100 dark:bg-zinc-950 rounded-lg items-center mt-4 h-full'>
        <div className="flex w-full h-full items-center justify-center">
          <Card className="flex-col w-full h-full">
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>
                {`You are seeing ${data?.user.name}'s recent posts.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-col w-full h-full rounded-t-lg  ">
                <Suspense fallback={<FeedSkeleton />}>
                  <PostFeed initialPosts={data?.posts} username={username} />
                </Suspense>
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
