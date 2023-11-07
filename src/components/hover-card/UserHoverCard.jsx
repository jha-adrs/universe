"use client"
import { CalendarIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import UserAvatar from "../UserAvatar"
import { getJoinedDate } from "@/lib/utils"
 
export function UserHoverCard({user, ...props}) {
  return (
    <HoverCard {...props}>
      <HoverCardTrigger asChild>
        <Button variant="link" className='m-0 p-0'>{user?.name}</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <UserAvatar user={user} size="md" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@{user?.username}</h4>
            <p className="text-sm">
                {user?.name}
            </p>
            <div className="flex items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                {getJoinedDate(user?.joinedDate)}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}