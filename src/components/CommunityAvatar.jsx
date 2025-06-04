"use client"
import config from '@/config/config'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import React from 'react'
import _ from 'lodash'
import Image from 'next/image'

const CommunityAvatar = ({ community, ...props }) => {
  let avatarURL = community?.image
  const name = community?.name || "AN"

  if (!avatarURL) {
    avatarURL = `https://ui-avatars.com/api/?name=${name}&background=random&rounded=true&size=128`
  }

  return (
    <Avatar className="rounded-full overflow-hidden" {...props}>
      <AvatarImage 
        className="rounded-full object-cover" 
        src={avatarURL} 
        alt={`r/${community.name}`} 
      />
      <AvatarFallback className="flex items-center justify-center bg-muted">
        {name?.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}

export default CommunityAvatar;