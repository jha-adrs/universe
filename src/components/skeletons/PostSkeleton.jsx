import React from 'react'
import { Skeleton } from '../ui/skeleton';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { buttonVariants } from '../ui/button';

const PostSkeleton = ({ count }) => {
    if (count === undefined) count = 1
    if (count > 8) count = 4
    const renderPosts = () => {
        const postSk = [];

        for (let i = 0; i < count; i++) {
            postSk.push(
                <div key={i} className='rounded-md bg-white shadow dark:bg-zinc-800 dark:text-white my-2'>
                    <div className="px-4 py-3 flex flex-col sm:flex-row">
                        <div className=' flex items-center flex-row sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0'>
                            <div className={buttonVariants({ variant: 'ghost' })}>
                                <ArrowBigUp className='w-5 h-5 text-zinc-700 dark:text-zinc-300 animate-pulse rounded-md bg-primary/10' />
                            </div>
                            <div className="text-center py-2 font-medium text-sm text-zinc-900 dark:text-zinc-300">
                                <Skeleton className='w-5 h-5 ' />
                            </div>
                            <div className={buttonVariants({ variant: 'ghost' })}>
                                <ArrowBigDown className='w-5 h-5 text-zinc-700 dark:text-zinc-300 animate-pulse rounded-md bg-primary/10' />
                            </div>
                        </div>
                        <div className="flex-1 mt-3 sm:mt-0 ">
                            <div className="text-xs gap-y-2 text-gray-500 dark:bg-zinc-800 dark:text-white">
                                <Skeleton className='w-36 h-5 my-2' />
                                <Skeleton className='w-10 h-5 my-2' />
                            </div>
                            <div className='relative text-sm max-h-40 '>
                                <Skeleton className='dark:bg-zinc-800 dark:text-white w-full h-36' />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return postSk;
    };

    return <div>{renderPosts()}</div>;
};

export default PostSkeleton// replace with your actual Skeleton component

