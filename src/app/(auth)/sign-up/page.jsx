import { Icons } from '@/components/Icons'
import Signup from '@/components/Signup'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='absolute inset-0'>
      <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
      
      <Signup/>
      </div>
    </div>
  )
}

export default page
