"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, BellRing, Shield, Palette, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

// Map of icon identifiers to their respective components
const iconMap = {
  user: User,
  palette: Palette,
  bell: BellRing,
  shield: Shield,
  globe: Globe
}

export function SidebarNav({ items }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col space-y-1">
      {items.map((item) => {
        // Get the icon component from our map
        const IconComponent = iconMap[item.icon]
        const isActive = pathname === item.href
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: isActive ? "default" : "ghost" }),
              "justify-start",
              isActive 
                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" 
                : "hover:bg-muted"
            )}
          >
            {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}