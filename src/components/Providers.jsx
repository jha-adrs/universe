"use client"
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

const Providers = ({children}) => {
    const queryClient = new QueryClient()
  return <QueryClientProvider client={queryClient} >
    <SessionProvider>
      {children}
    </SessionProvider>
    
  </QueryClientProvider>
}

export default Providers
