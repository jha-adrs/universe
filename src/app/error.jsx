'use client'
import Image from 'next/image'
import { useEffect } from 'react'
import ErrorSvg from "../../public/error.svg"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
export default function Error({
    error,
    reset,
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])
    return (
        <div className='flex flex-col h-screen w-screen items-center justify-center inset-0'>
            <h2 className='text-3xl font-bold text-primary'>Something went wrong!</h2>
            <Image src={ErrorSvg} alt="Error Page" width={400} height={400} />
            <div className="flex flex-col gap-y-4 items-center justify-between">
            <Button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Try again
            </Button>
            <Button variant={"default"}>
                <Link href={"/"}>
                Home Page
                </Link>
            </Button>
            </div>
        </div>
    )
}