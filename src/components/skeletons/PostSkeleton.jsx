import React from 'react'
import { Skeleton } from '../ui/skeleton';

const PostSkeleton = ({ count }) => {
    if (count === undefined) count = 1
    if (count > 10) count = 10
    const renderPosts = () => {
        const postSk = [];

        for (let i = 0; i < count; i++) {
            postSk.push(
                <div className='rounded-md bg-white dark:bg-zinc-800 dark:text-white shadow m-2'>
                    <div className="px-6 py-4 flex justify-between">
                        <Skeleton className='w-6 h-6 text-zinc-500 ' />
                        <div className="w-0 flex-1">
                            <div className="max-h-40 mt-1 text-xs text-gray-500 justify-between flex">
                                <Skeleton className='underline text-zinc-900 text-sm underline-offset-2' />
                                <span className="px-1"></span>

                                <div className=''>
                                    <span className="text-gray-900">
                                        <Skeleton className="text-gray-400 h-4 w-8" />
                                    </span>
                                    {'  '}
                                    <Skeleton className='h-4 w-4' />
                                </div>
                            </div>
                            <Skeleton className="text-lg font-semibold py-2 leading-6 text-gray-900" />
                            <div className='relative text-sm max-h-40 w-full overflow-clip'>
                                <Skeleton className="absolute bottom-0 left-0 h-24 w-full bg-transparent" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-zinc-800 dark:text-white z-20 text-sm p-4 sm:px-6">
                        <Skeleton className='w-fit flex items-center gap-2' />
                    </div>
                </div>
            );
        }

        return postSk;
    };

    return <div>{renderPosts()}</div>;
};

export default PostSkeleton
