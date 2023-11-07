"use client"
import React, { startTransition } from 'react'
import { Button, buttonVariants } from './ui/button'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import Link from 'next/link'
import { useToast } from './ui/use-toast'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { useRouter } from 'next/navigation'
import { Icons } from './Icons'

const SubscribeLeaveToggle = ({subscriptionStatus,communityId, ...props}) => {
    const {toast} = useToast();
    const {loginToast} = useCustomToasts();
    const router = useRouter();
    const {mutate: subscribe, isLoading: isSubLoading} = useMutation({
        mutationFn: async()=>{
            const payload ={
                communityId,
            }
            const {data} = await axios.post('/api/community/subscribe',payload)
            return data;
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 400) {

                    return toast({
                        title: 'You are already subscribed!',
                        description: 'Look around or create a post',
                        variant: 'default',
                        
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
        onSuccess: () => {
            startTransition(()=>{
                router.refresh();
            })
                return toast({
                     title: 'Subscription Success!',
                     description: 'You are now a member of this community',
                     variant: 'success',
                     })
             
        }
    })

    const {mutate: leave, isLoading: isLeaveLoading} = useMutation({
        mutationFn: async()=>{
            const payload ={
                communityId,
            }
            const {data} = await axios.post('/api/community/leave',payload)
            return data;
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 400) {

                    return toast({
                        title: 'You are not a member!',
                        description: 'Subscribe to leave a community',
                        variant: 'destructive',
                        
                    })
                }
                if (error.response?.status === 407) {

                    return toast({
                        title: 'You are the creator!',
                        description: 'Transfer ownership to leave the community',
                        variant: 'destructive',
                        
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
        onSuccess: () => {
            startTransition(()=>{
                router.refresh();
            })
                return toast({
                     title: 'You left the community!',
                     description: 'You are no longer a member of this community',
                     variant: 'success',
                     })
             
        }
    })

    return subscriptionStatus ? (
        <Button className="w-full mt-1 mb-4" variant="destructive" onClick={()=>leave()}>
            {isLeaveLoading ? <Icons.spinner className='animate-spin' /> : "Un-subscribe"}
        </Button>
    ):
    (
        <Button isLoading={isSubLoading} className="w-full mt-1 mb-4" variant = "black" onClick={()=>subscribe()} >
            {isSubLoading ? <Icons.spinner className='animate-spin' /> : "Subscribe"}
        </Button>
    )
}

export default SubscribeLeaveToggle
