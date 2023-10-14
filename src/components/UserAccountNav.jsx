"use client"
import React from 'react'
import { Button, buttonVariants } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { CaretDownIcon, PlusIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Icons } from './Icons'
import { cn } from '@/lib/utils'

export function UserAccountNav({ user, ...props }) {
    // TODO: Add custom avatar uploaded by user
    let avatarURL = user?.image
    const name = user?.name
    const username = user?.username
    if (!avatarURL) avatarURL = `https://ui-avatars.com/api/?name=${name}&background=random&rounded=true&size=128`

    // TODO Get communities from user
    // TODO: Add communities page
    // TODO: Add server redirecting to communities page
    // TODO: Add URL for each community in an object
    const communities = props.communities || ['No Communities Found','a','b','No Communities Found','a','b','No Communities Found','a','b','No Communities Found','a','b','No Communities Found','a','b']

    const handleSignout = async () => {

        signOut({
            callbackUrl: `${window.location.origin}/sign-in`,
        })
    }
    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-2 ">
                    <Avatar className=' w-7 h-7'>
                        <AvatarImage src={`${avatarURL}`} alt={`@${username}`} />
                        <AvatarFallback>{name?.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className='ml-3'>{username}</span>
                    <CaretDownIcon className='w-5 h-5 ml-2' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="bg-customred rounded">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Link href='/'>Feed</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href='/profile'>Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href='/settings'>Settings</Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>My Communities</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <ScrollArea className="h-72  rounded-md border">
                                    
                                    <div className="p-4">
                                        <h4 className="mb-4 text-sm font-medium leading-none">Your Communities</h4>
                                        <hr className='h-0.25 bg-gray-400'/>
                                        {communities.map((community, index) => {
                                             return <DropdownMenuItem key={index}>
                                                <Link href='/c/[community]' as={`/c/${community}`} className={cn("w-full justify-start",buttonVariants({variant:'ghost'}))}>
                                                    {community}</Link>
                                             </DropdownMenuItem>
                                           
                                        })}
                                    </div>
                                </ScrollArea>

                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <DropdownMenuItem>
                        <Link href='/q/create'>Create a Community </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href='/interactions'>My Interactions </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href='/notifications'>Notifications</Link> {/*Add modal */}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link href='/messages'>Direct Messages </Link> {/*Add modal */}
                </DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuItem disabled>API</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onSelect={(event) => {
                        event.preventDefault()
                        handleSignout()
                    }} >
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export default UserAccountNav