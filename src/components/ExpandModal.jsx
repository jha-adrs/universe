"use client"
import Link from 'next/link'
import React from 'react'
import { cn } from '@/lib/utils'
import {  buttonVariants } from './ui/button'
import { Maximize2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
const ExpandModal = (props) => {
    const router = useRouter();
  return (
    <div>
      <Link href='/' className={cn(buttonVariants({ variant: 'ghost' }), 'self-start -mt-20')} {...props}> 
      <Maximize2 onClick={()=>window.location.reload()} className='w-4 h-4'/> 
      </Link>
    </div>
  )
}

export default ExpandModal
