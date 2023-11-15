"use client"
import config from '@/config/config'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import React from 'react'
import _ from 'lodash'
const UserAvatar = ({ user, ...props }) => {
  let avatarURL = user?.image
  //let avatarURL = null
  const name = user?.name || 'AN'
  const username = user?.username || "anonymous"
  if (!avatarURL) avatarURL = _.sample(config.AVATAR_FALLBACKS) || `https://ui-avatars.com/api/?name=${name}&background=random&rounded=true&size=128`
  // TODO: Add Link to User Profile
  // TODO: Add custom avatar uploaded by user
  // TODO: Round the corners of the avatar
  return (
    <Avatar className='rounded-full' >
      <AvatarImage className='rounded-full '  src={`${avatarURL}`} alt={`@${username}`}  {...props} />
      <AvatarFallback>{name?.slice(0, 2)}</AvatarFallback>
    </Avatar>

  )
}
export default UserAvatar;