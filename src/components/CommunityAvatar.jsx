"use client"
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import React from 'react'

const CommunityAvatar = ({ community, ...props }) => {
  let avatarURL = community?.image
  //let avatarURL = null
  const name = community?.name || AN
  //const username = community?.username || anonymous
  if (!avatarURL) avatarURL = `https://ui-avatars.com/api/?name=${name}&background=random&rounded=true&size=128`
  // TODO: Add Link to User Profile
  // TODO: Add custom avatar uploaded by user
  // TODO: Round the corners of the avatar
  return (
    <Avatar className='  rounded-full' >
      <AvatarImage className='rounded-full '  src={`${avatarURL}`} alt={`r/${community.id}`}  {...props}/>
      <AvatarFallback>{name?.slice(0, 2)}</AvatarFallback>
    </Avatar>

  )
}
export default CommunityAvatar;