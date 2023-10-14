import React from 'react'
import { Icons } from './Icons'
import Link from 'next/link'
import UserAuthForm from './UserAuthForm'
import { cn } from '@/lib/utils'
import { buttonVariants } from './ui/button'
const Signup = () => {
    return (
    <>
        <div className='container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]'>
            <div className="flex flex-col space-y-2 text-center">
                <Icons.logo className='w-20 h-20 mx-auto' />
                <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>
                <p className="text-sm max-w-xs mx-auto">
                    By continuing, you in your own discretion within your complete conscience agree to well nothing really. This is just a demo.
                </p>
                <UserAuthForm />
                <p className="px-8 text-center text-sm">
                    Already a member? {' '}<Link href='/sign-in' className=' text-slate-950 dark:bg:slate-700 dark:text-white bg-slate-50 dark:bg-slate-900 underline'>Login in</Link>
                </p>
            </div>
        </div>
    </>
    )
}

export default Signup
