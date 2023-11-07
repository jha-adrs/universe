import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './theme-provider'
import { switchThemeDuration } from '@/lib/constants'
import Navbar from '@/components/Navbar'
import { cn } from '@/lib/utils'
const inter = Inter({ subsets: ['latin'] })
import { Toaster } from '@/components/ui/toaster'
import Providers from '@/components/Providers'
export const metadata = {
  title: 'UniVerse',
  description: 'A UniVerse for all your needs',
}
// TODO: Add close modal on click outside and on a different route like sign-up from sign-in
export default function RootLayout({ children , authModal}) {
  return (
    <html
      lang='en'
      className={cn(
        'bg-white text-slate-900 antialiased light',
        inter.className
      )}>
      <body className='min-h-screen pt-12 bg-slate-50 antialiased'>
          <Providers>
          <Navbar />
          {authModal}
          <div className='container max-w-7xl mx-auto h-full pt-12'>
            {children}
          </div>
          <Toaster />
          </Providers>
      </body>
    </html>
  )
}
