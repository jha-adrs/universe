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
            <div className='h-full px-6 py-4 flex justify-between gap-6'>
                <div className="relative">
                    <UserAvatar user={session?.user} className='h-12 w-12 ' />
                    <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 outline list-outside-2 outline-white" />
                </div>
            <Input readOnly onClick={()=> router.push(pathname+'/submit')} placeholder="Create a Post"/>
            
            <Link href={`${pathname}/submit`} className={buttonVariants({variant:"ghost"})}><ImageIcon /> </Link>
            <Link href={`${pathname}/submit`} className={buttonVariants({variant:"ghost"})}><Link1Icon/> </Link>
            </div>
        </li>
    )
}

export default MiniCreatePost
