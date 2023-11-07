"use client"
import { CalendarIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { getJoinedDate } from "@/lib/utils"
import CommunityAvatar from "../CommunityAvatar"
 
export function CommunityHoverCard({community, ...props}) {
  return (
    <HoverCard {...props}>
      <HoverCardTrigger asChild>
        <Button variant="link" className='m-0 p-0'>{community?.name}</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-60 max-h-100">
        <div className="flex justify-between space-x-4">
          <CommunityAvatar community={community} size="lg" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">r/{community?.name}</h4>
            <p className="text-sm">
                {community?.description}
            </p>
            <div className="flex items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                {getJoinedDate(community?.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}