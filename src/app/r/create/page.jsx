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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Link from 'next/link'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { AlertTriangleIcon, ChevronDownIcon, SmartphoneIcon } from 'lucide-react'
import _, { capitalize } from 'lodash'
import DOMPurify from 'dompurify'

const Page = () => {
    const { toast } = useToast();
    const { loginToast } = useCustomToasts();
    const router = useRouter();
    const [communityName, setCommunityName] = useState("");
    const [communityDescription, setCommunityDescription] = useState("");
    const [communityVisibility, setCommunityVisibility] = useState("PUBLIC");
    const [communityNameError, setCommunityNameError] = useState("");
    const [communityDescriptionError, setCommunityDescriptionError] = useState("");

    const { mutate: createCommunity, isLoading } = useMutation({
        mutationFn: async () => {
            if (!communityName) {
                setCommunityNameError("Community name is required");
                return;
              }
              if (!/^[A-Za-z0-9-_]+$/.test(communityName)) {
                setCommunityNameError("Community name must be URL compatible (lower case alphabets, numbers, underscores and hyphens only)");
                return;
              }
              if (!communityDescription) {
                setCommunityDescriptionError("Community description is required");
                return;
              }
              setCommunityName(_.toLower(communityName))

            const payload = {
                name: DOMPurify.sanitize(communityName),
                description: DOMPurify.sanitize(communityDescription),
                visibility: communityVisibility || "PUBLIC"
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
                        description: 'Please try another name between 3 and 50 characters, and only letters, numbers, and underscores are allowed',
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
                    title: `${capitalize(communityVisibility)} Community created!`,
                    description: 'You can now post to your community',
                    variant: 'success',
                    action: (
                        <Link
                            href={`/r/${communityName}`}
                            className={buttonVariants({ variant: 'outline' })}>
                            Visit
                        </Link>
                    )
                })
            }
        }
    })
    // TODO: Add community visibility options
    
    return (
        <div className='container flex items-center h-full max-3xl mx-auto'>
            <div className="relative bg-white  dark:text-white dark:bg-zinc-800  w-full h-fit p-4 rounded-lg space-y-6">
                <div className="flex justify-between items-center ">
                    <h1 className="text-xl font-semibold">
                        Create a new community
                    </h1>
                </div>
                <Separator />
                <div>
                    <p className="text-lg font-medium mb-2">Community Name</p>
                    <p className='text-xs py-2'>Only numbers, underscores and alphabets are allowed .</p>
                    <div className="relative">
                        <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400 ">
                            r/
                        </p>
                        <Input  type="name" id="name" placeholder="Supernova" value={communityName} onChange={(e) => {setCommunityNameError(""); setCommunityName(e.target.value);}} className={`pl-6 ${communityNameError? 'border-red-500':''}`} />
                        
                    </div>
                    {communityNameError && <p className='flex flex-row text-xs font-semibold text-red-500 py-2'><AlertTriangleIcon className='w-4 h-4'/> 
                    {communityNameError || "Only numbers, underscores and alphabets are allowed."}
                    </p>}
                    <p className="text-lg font-medium my-2">Community Description</p>

                    <div className="relative">

                        <Textarea
                            type="description" id="description" placeholder="Something about your new community" value={communityDescription} onChange={(e) => setCommunityDescription(e.target.value)} className='pl-2 h-15' />
                            
                    </div>
                    <p className="text-lg font-medium my-2">
                        Community Visibility
                    </p>
                    <div className="relative max-w-fit">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    {capitalize(communityVisibility)}{" "}
                                    <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0" align="start">
                                <Command >
                                    <CommandList >
                                        <CommandEmpty>No types found.</CommandEmpty>
                                        <CommandGroup>
                                            <CommandItem   className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                                                <div onClick={()=>setCommunityVisibility("PUBLIC")}>
                                                <p >Public</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Anyone can join, view, post, and comment.
                                                </p>
                                                </div>
                                            </CommandItem>
                                            <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                                            <div onClick={()=>setCommunityVisibility("PRIVATE")}>
                                                <p >Private</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Only approved members can join, view, post, and comment.
                                                </p>
                                                </div>
                                            </CommandItem>
                                            <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                                            <div onClick={()=>setCommunityVisibility("RESTRICTED")}>
                                                <p >Restricted</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Anyone can view, approval required to join, post, and comment.
                                                </p>
                                                </div>
                                            </CommandItem>
                                           
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

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
                        disabled={communityName.length === 0 || communityDescription.length === 0 || isLoading || communityNameError  || communityDescriptionError}
                        onClick={() => createCommunity()}>
                        {isLoading ? <Icons.spinner className='animate-spin' /> : "Create Community"}
                    </Button>
                </div>

            </div>
        </div>
    )
}

export default Page
