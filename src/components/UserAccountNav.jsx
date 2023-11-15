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
import { CaretDownIcon, PlusCircledIcon, PlusIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Icons } from './Icons'
import { cn } from '@/lib/utils'
import { BellDot, HelpCircle, HistoryIcon, InboxIcon, LogOutIcon, NewspaperIcon, Plus, UserCircle, UserCog2, Users2, Users2Icon } from 'lucide-react'
import config from '@/config/config'
import _ from 'lodash'
export function UserAccountNav({ user, ...props }) {
    // TODO: Add custom avatar uploaded by user
    let avatarURL = user?.image
    const name = user?.name
    const username = user?.username
    if (!avatarURL) avatarURL = _.sample(config.AVATAR_FALLBACKS) || `https://ui-avatars.com/api/?name=${name}&background=random&rounded=true&size=128`

    const handleSignout = async () => {

        signOut({
            callbackUrl: `${window.location.origin}/sign-in`,
        })
    }

    const findJoinedDuration = (dateJoined) => {
        if(!dateJoined) return '_'
        const joinedDate = new Date(dateJoined)
        const currentDate = new Date()
        const diffTime = Math.abs(currentDate - joinedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 30) {
            return `${diffDays}d`
        }
        else if (diffDays < 365) {
            const diffMonths = Math.ceil(diffDays / 30)
            return `${diffMonths}m`
        }
        else {
            const diffYears = Math.ceil(diffDays / 365)
            return `${diffYears}y`
        }
    }


    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-2  mt-0.5 ">
                    <Avatar className=' w-7 h-7'>
                        <AvatarImage src={`${avatarURL}`} alt={`@${username}`} />
                        <AvatarFallback>{name?.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className='ml-3'>{username}</span>
                    <CaretDownIcon className='w-5 h-5 ml-2' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 dark:text-zinc-300 dark:bg-black">
                <DropdownMenuLabel className="rounded">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Link href='/' className='flex flex-row place-items-center'><NewspaperIcon className='mr-2'/> Feed</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href='/profile' className='flex flex-row place-items-center'><UserCircle className='mr-2'/> Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href='/settings' className='flex flex-row place-items-center'><UserCog2 className='mr-2'/> Settings</Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Link href='/u/subscriptions'className='flex flex-row place-items-center' >
                        <Users2Icon className='mr-2'/>  My Communities
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                        <Link href='/r/create'className='flex flex-row place-items-center' ><Plus className='mr-2' /> Create a Community </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href='/interactions' className='flex flex-row place-items-center' ><HistoryIcon className='mr-2'/>My Interactions </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href='/notifications' className='flex flex-row place-items-center' ><BellDot className='mr-2'/> Notifications</Link> {/*Add modal */}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link href='/messages' className='flex flex-row place-items-center' ><InboxIcon className='mr-2'/>Direct Messages </Link> {/*Add modal */}
                </DropdownMenuItem>
                <DropdownMenuItem>
                <Link href='/messages' className='flex flex-row place-items-center' ><HelpCircle className='mr-2'/> Support  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onSelect={(event) => {
                        event.preventDefault()
                        handleSignout()
                    }}  
                    className='flex flex-row place-items-center focus:bg-rose-300 dark:focus:bg-rose-600 dark:bg-black dark:text-white' >
                   <LogOutIcon className='mr-2'/> Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export default UserAccountNav