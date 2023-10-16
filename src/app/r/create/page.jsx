"use client"
import React, { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { Icons } from '@/components/Icons'
import Link from 'next/link'

const Page = () => {
    const { toast } = useToast();
    const { loginToast } = useCustomToasts();
    const router = useRouter();
    const [communityName, setCommunityName] = useState("");
    const [communityDescription, setCommunityDescription] = useState("");

    const { mutate: createCommunity, isLoading } = useMutation({
        mutationFn: async () => {
            const payload = {
                name: communityName,
                description: communityDescription
            }
            const { data } = await axios.post('/api/community', payload)
            return data;
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {

                    return toast({
                        title: 'Community already exists!',
                        description: 'Please try another name',
                        variant: 'default',
                        action: (
                            <Link
                                href={`/r/${communityName}`}
                                className={buttonVariants({ variant: 'outline' })}>
                                Visit
                            </Link>
                        )
                    })
                }
                if (error.response?.status === 422) {
                    return toast({
                        title: 'Community name invalid',
                        description: 'Please try another name between 3 and 50 characters',
                        variant: 'destructive'
                    })
                }
                if (error.response?.status === 401) {
                    return loginToast()
                }
            }

            return toast({
                title: 'Something went wrong',
                description: 'Please try again later',
                variant: 'destructive'
            })

        },
        onSuccess: (data) => {
            if (data) {
                return toast({
                     title: 'Community created!',
                     description: 'You can now post to your community',
                     variant: 'success',
                     action: (
                         <Link
                             href={`/r/${communityName}`}
                             className={buttonVariants({ variant: 'outline' })}>
                             Visit
                         </Link>
                     )})
             }
        }
    })

    return (
        <div className='container flex items-center h-full max-3xl mx-auto'>
            <div className="relative bg-white  dark:text-white dark:bg-slate-700 w-full h-fit p-4 rounded-lg space-y-6">
                <div className="flex justify-between items-center ">
                    <h1 className="text-xl font-semibold">
                        Create a new cluster
                    </h1>
                </div>
                <Separator />
                <div>
                    <p className="text-lg font-medium mb-2">Community Name</p>
                    <p className='text-xs py-2'>Community names cannot be changed later.</p>
                    <div className="relative">
                        <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400 ">
                            r/
                        </p>
                        <Input type="name" id="name" placeholder="Supernova" value={communityName} onChange={(e) => setCommunityName(e.target.value)} className='pl-6' />
                    </div>
                    <p className="text-lg font-medium my-2">Community Description</p>

                    <div className="relative">

                        <Textarea
                            type="description" id="description" placeholder="Something about your new community" value={communityDescription} onChange={(e) => setCommunityDescription(e.target.value)} className='pl-2 h-15' />
                    </div>
                </div>
                <div className='flex justify-end gap-4'>
                    {/*Add isLoading options */}
                    <Button
                        disabled={isLoading}
                        variant='secondary'
                        onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button
                        variant='black'
                        disabled={communityName.length === 0 || communityDescription.length === 0 || isLoading}
                        onClick={() => createCommunity()}>
                        {isLoading ? <Icons.spinner className='animate-spin' /> : "Create Community"}
                    </Button>
                </div>

            </div>
        </div>
    )
}

export default Page
