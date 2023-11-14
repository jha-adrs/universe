import { authOptions, getAuthSession } from '@/lib/auth'
import { getSession } from 'next-auth/react'
import React from 'react'
import {redirect} from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import config from '@/config/config'
import { SidebarNav } from '@/components/settings/Sidebarnav'
export const metadata = {
    title: 'Settings',
    description: 'Settings page',

}
const page = async({children}) => {

    const session = await getAuthSession()
    if(!session?.user) {return redirect(authOptions.pages?.signIn || '/sign-in')}

  return (
    <div className='max-w-4xl mx-auto py-12'>
        <div className="grid items-start gap-8">
        <>
      <div className="md:hidden">
      </div>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={config.SIDEBAR_ITEMS} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
        </div>
    </div>
  )
}


export default page
