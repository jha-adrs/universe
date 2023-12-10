"use client"
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import { ThemeProvider } from '@/app/theme-provider'
import { TooltipProvider } from './ui/tooltip'
const Providers = ({children}) => {
    const queryClient = new QueryClient()
  return <QueryClientProvider client={queryClient} >
    <SessionProvider>
      <ThemeProvider attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
     <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
    
  </QueryClientProvider>
}

export default Providers
