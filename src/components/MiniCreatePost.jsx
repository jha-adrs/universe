"use client"
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import UserAvatar from './UserAvatar';
import { Input } from './ui/input';
import { Button, buttonVariants } from './ui/button';
import Link from 'next/link';
import { ImageIcon, Link1Icon } from '@radix-ui/react-icons';

const MiniCreatePost = ({ session }) => {
    const router = useRouter();
    const pathname = usePathname();


    return (
        <li className='overflow-hidden rounded-md bg-white shadow list-none '>
            <div className='h-fit px-6 py-4 flex justify-between gap-6'>
                <div className="relative">
                    <UserAvatar user={session?.user} className='h-fit w-fit max-w-11 max-h-11  rounded-full' />
                    <span className="absolute bottom-0 right-0 rounded-full w-2 h-2 bg-green-500 outline list-outside-1 outline-white" />
                </div>
            <Input readOnly onClick={()=> router.push(pathname+'/submit')} placeholder="Create a Post"/>
            
            <Link href={`${pathname}/submit`} className={buttonVariants({variant:"ghost"})}><ImageIcon /> </Link>
            <Link href={`${pathname}/submit`} className={buttonVariants({variant:"ghost"})}><Link1Icon/> </Link>
            </div>
        </li>
    )
}

export default MiniCreatePost
