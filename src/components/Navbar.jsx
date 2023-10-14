
import React from 'react'
import { ThemeSwitcher } from './ThemeSwitcher'
import Link from 'next/link'
import { Icons } from './Icons'
import { buttonVariants } from './ui/button'
import { getAuthSession } from '@/lib/auth'
import UserAccountNav from './UserAccountNav'
const Navbar =async () => {

  // Get session
  const session = await getAuthSession()
  

  return (
    <div className='fixed top-0 inset-x-0 h-fit z-10  py-2 bg:white text-slate-950 dark:bg:slate-700 dark:text-white bg-slate-50 dark:bg-slate-900'>
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-center gap-2">
      
      <Link href='/' className='flex gap-2 items-center mr-5'>
        <Icons.logo className='w-15 h-15 sm:h-10 sm:w-10' />
         <p className="hidden md:block font-bold"> UniVerse</p>
      </Link>
      {session?.user ? (
        <UserAccountNav user ={session.user}/>
      ):(
        <Link href='/sign-in' className={buttonVariants({variant:"black"})}>Sign In</Link>
      )}
      

      <ThemeSwitcher/>
      </div>
      
    </div>
  )
}

export default Navbar

/**
 * <NavigationMenu className="items-center justify-between max-w-15">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink>Link</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/docs" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Documentation
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
 */