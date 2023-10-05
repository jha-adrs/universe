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
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { CaretDownIcon, PlusIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

export function UserAccountNav({ user , ...props}) {
    // TODO: Add custom avatar uploaded by user
    let avatarURL = user?.image
    const name = user?.name
    const username = user?.username
    if(!avatarURL) avatarURL = `https://ui-avatars.com/api/?name=${name}&background=random&rounded=true&size=128`
    
    // TODO Get communities from user
    // TODO: Add communities page
    // TODO: Add server redirecting to communities page
    // TODO: Add URL for each community in an object
    const communities = props.communities || ['No Communities Found']

    const handleSignout = async () => {
        signOut({
            callbackUrl: `${window.location.origin}/sign-in`,
        })
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-2 ">
                    <Avatar className=' md:w-7 md:h-7 '>
                        <AvatarImage src={`${avatarURL}`} alt={`@${username}`} />
                        <AvatarFallback>{name}</AvatarFallback>
                    </Avatar>
                    <span className='ml-3'>{username}</span>
                    <CaretDownIcon className='w-5 h-5 ml-2' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
                                {communities.map((community, index) => {
                                    if(index < 3) return <DropdownMenuItem key={index}>{community}</DropdownMenuItem>
                                    else if (index ==3) return <DropdownMenuItem key={index}><Link href='/mycommunities'>More...</Link></DropdownMenuItem>
                                })}
                                
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <DropdownMenuItem>
                    <Link href='/r/create'>Create a Community </Link>
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
                <DropdownMenuItem onSelect={(event)=>{
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