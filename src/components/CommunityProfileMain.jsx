"use client"
import React from 'react'
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { ImagePlus } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import CommunityAvatar from '@/components/CommunityAvatar';
import SubscribeLeaveToggle from '@/components/SubscribeLeaveToggle';
const CommunityProfileMain = ({ community,subscriptionStatus }) => {
    return (
        <Card className="flex-col w-full h-full">
            <CardHeader>
                <div className="relative w-full inline-flex h-36 rounded-t-md overflow-hidden">
                    <Image className="rounded-t-lg" fill style={{ "objectFit": "cover" }} alt="Cover Image" src="https://utfs.io/f/b33605dd-87a3-48e8-bdc5-04e7026c203a-tbokdq.jpg" />
                    <div className="absolute top-2 right-2 rounded-full w-6 h-6 dark:bg-gray-900/50 flex items-center justify-center hover:bg-gray-500 bg-gray-900 hover:dark:bg-gray-900">
                        <ImagePlus className=' text-white/50 cursor-pointer' size={16} />
                    </div>
                </div>

            </CardHeader>
            <CardContent className="flex flex-row space-y-2">
                <div className=" relative gap-x-4 h-12 ml-2">
                    <CommunityAvatar community={community} className='rounded-full w-12  ' />
                    <div className="absolute -bottom-1 -right-1 rounded-full w-6 h-6 dark:bg-gray-900/50 flex items-center justify-center hover:bg-gray-900 bg-gray-500 hover:dark:bg-gray-900">
                        <ImagePlus className=' text-white cursor-pointer' size={16} />
                    </div>
                </div>
                <div className="flex flex-row ml-4 w-full justify-between  overflow-hidden">
                    <div className="flex flex-col h-fit w-[70%] mr-4 overflow-hidden ">
                        <div className="font-bold text-xl dark:text-white">r/{community?.name}</div>
                    </div>
                    <div className="w-fit flex  flex-col justify-start items-start">
                        <SubscribeLeaveToggle communityId={community.id} subscriptionStatus={subscriptionStatus} className="w-fit " />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default CommunityProfileMain
