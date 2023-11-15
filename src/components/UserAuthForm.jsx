"use client"
import React from 'react'
import { Button, buttonVariants } from './ui/button'
import { cn } from '@/lib/utils'
import { Icons } from './Icons'
import { signIn } from 'next-auth/react'
import config from '@/config/config'
import { useToast } from './ui/use-toast'
import { Input } from "@/components/ui/input"
//import { logger } from '@/lib/logger'
const UserAuthForm = ({ className, ...props }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const { toast } = useToast();
    const availableProviders = config.AVAILABLE_AUTH_PROVIDERS;

    // TODO: Add toast when user clicks on a disabled button
    const loginWithMagicLink = () => {
        setIsLoading(true);

        try {
           const res =  signIn('email',{callbackUrl: '/', email: email})
           console.log(res);
            //throw new Error("Not implemented");
            setIsLoading(false);
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            })
        }
    }
    const loginWithGoogle = () => {
        setIsLoading(true);
        try {
            signIn('google', )
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            })
            setIsLoading(false);
        }
    }
    const loginWithGithub = () => {
        setIsLoading(true);
        try {
            const res = signIn('github',{callbackUrl: '/'})
            console.log(res);
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            })
            setIsLoading(false);
        }
    }

    return (
        <div>
            <div className="relative flex justify-center text-xs flex-col">  
            <Input type='email' placeholder='Email' className='w-full' onChange={(e)=>{setEmail(e.target.value)}}/>
            <Button variant='default' onClick={loginWithMagicLink} className={cn('flex justify-center m-2 dark:border-white ', className)} disabled={isLoading || !availableProviders['magic_link']}>
                {isLoading ? (<Icons.spinner className='w-5 h-5 mr-2 animate-spin' />) : 'Sign in using magic link'}
            </Button>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-muted-foreground">
                    Or continue with
                </span>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-stretch m-2">
                <Button onClick={loginWithGoogle} variant='outline' className={cn('flex m-2', className)} disabled={isLoading || !availableProviders['google']}>
                    {isLoading ? <Icons.spinner className='w-5 h-5 mr-2 animate-spin' /> : <Icons.google className='w-5 h-5 mr-2' />} Google
                </Button>
                <Button onClick={loginWithGithub} variant='outline' className={cn('flex m-2', className)} disabled={isLoading || !availableProviders['github']}>
                    {isLoading ? <Icons.spinner className='w-5 h-5 mr-2 animate-spin' /> : <Icons.github className='w-5 h-5 mr-2' />}Github</Button>
                <Button variant='outline' className={cn('flex m-2', className)} disabled={isLoading || !availableProviders['microsoft']}>
                    {isLoading ? <Icons.spinner className='w-5 h-5 mr-2 animate-spin' /> : <Icons.microsoft className='w-5 h-5 mr-2' />}Microsoft</Button>
            </div>
        </div>
    )
}

export default UserAuthForm
