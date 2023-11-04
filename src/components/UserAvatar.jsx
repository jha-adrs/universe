"use client"
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import React from 'react'

const UserAvatar = ({ user, ...props }) => {
  let avatarURL = user?.image
  //let avatarURL = null
  const name = user?.name
  const username = user?.username
  if (!avatarURL) avatarURL = `https://ui-avatars.com/api/?name=${name}&background=random&rounded=true&size=128`
  // TODO: Add Link to User Profile
  // TODO: Add custom avatar uploaded by user
  // TODO: Round the corners of the avatar
  return (
    <Avatar className=' w-5 h-5 rounded-full' {...props}>
      <AvatarImage className='rounded-full w-fit h-fit'  src={`${avatarURL}`} alt={`@${username}`}  />
      <AvatarFallback>{name?.slice(0, 2)}</AvatarFallback>
    </Avatar>

  )
}
export default UserAvatar;