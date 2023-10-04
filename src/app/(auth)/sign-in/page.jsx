import { Icons } from '@/components/Icons'
import Signin from '@/components/Signin'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='absolute inset-0'>
      <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
      <Link href='/' className={cn(buttonVariants({variant: 'outline'}), 'self-start -mt-20')}> <Icons.arrow className='w-6 h-6 transform rotate-180'/> Back to Home</Link>
      <Signin/>
      </div>
    </div>
  )
}

export default page
