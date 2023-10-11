import React from 'react'
import { Icons } from './Icons'
import Link from 'next/link'
import UserAuthForm from './UserAuthForm'
import { cn } from '@/lib/utils'
import { buttonVariants } from './ui/button'
const Signin = () => {
  return (<><Link href='/' className={cn(buttonVariants({ variant: 'outline' }), 'self-start -mt-20')}> <Icons.arrow className='w-6 h-6 transform rotate-180' /> Home</Link>
    <div className='container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]'>
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className='w-20 h-20 mx-auto' />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm max-w-xs mx-auto">
          By continuing, you in your own discretion within your complete conscience agree to well nothing really. This is just a demo.
        </p>
        <UserAuthForm />
        <p className="px-8 text-center text-sm">
          New to this UniVerse? {' '}<Link href='/sign-up' className=' text-slate-950 dark:bg:slate-700 dark:text-white bg-slate-50 dark:bg-slate-900 underline'>Create an account</Link>
        </p>
      </div>
    </div>
  </>
  )
}

export default Signin
