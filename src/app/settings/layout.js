import { authOptions, getAuthSession } from '@/lib/auth'
import React from 'react'
import { redirect } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { SidebarNav } from '@/components/settings/Sidebarnav'

export const metadata = {
  title: 'Settings',
  description: 'Manage your account settings and preferences',
}

// Simple sidebar items without icons (icons will be added in the client component)
const SIDEBAR_ITEMS = [
  {
    title: "Account",
    href: "/settings",
    icon: "user" // String identifier for the icon
  },
  {
    title: "Appearance",
    href: "/settings/appearance",
    icon: "palette"
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
    icon: "bell"
  },
  {
    title: "Privacy",
    href: "/settings/privacy",
    icon: "shield"
  },
  {
    title: "Language",
    href: "/settings/language",
    icon: "globe"
  }
]

const SettingsLayout = async ({ children }) => {
  const session = await getAuthSession()
  
  if (!session?.user) {
    return redirect(authOptions.pages?.signIn || '/sign-in')
  }

  return (
    <div className="container max-w-6xl py-8 mx-auto">
      <div className="space-y-0.5 mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <Separator className="mb-6" />
      
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-1/5">
          <SidebarNav items={SIDEBAR_ITEMS} />
        </aside>
        
        <div className="flex-1 lg:max-w-3xl space-y-6 p-4 border rounded-lg bg-card">
          {children}
        </div>
      </div>
    </div>
  )
}

export default SettingsLayout
