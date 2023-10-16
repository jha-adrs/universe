"use client"
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import React from 'react'

const UserAvatar = ({ user, ...props }) => {
  //let avatarURL = user?.image
  let avatarURL = null
  const name = user?.name
  const username = user?.username
  if (!avatarURL) avatarURL = `https://ui-avatars.com/api/?name=${name}&background=random&rounded=true&size=128`
  // Add Link to User Profile
  return (
    <Avatar >
      {user.image ? (
        <div className='relative aspect-square h-full w-full' {...props}>

          <AvatarImage src={`${avatarURL}`} alt={`@${username}`}
            referrerPolicy='no-referrer' />
        </div>
      ) : (
        <AvatarFallback {...props}>
          <span className='sr-only'>{user?.name}</span>
          {name?.slice(0, 2)}
        </AvatarFallback>
      )}
    </Avatar>
  )
}
export default UserAvatar;