import React from 'react'
import { notFound } from 'next/navigation'
import PostVoteClient from './PostVoteClient'
import { logger } from '@/lib/logger'
import { getAuthSession } from '@/lib/auth'
const PostVoteServer =async ({
    postId,
    initialVotesAmt,
    initialVote,
    getData
}) => {
  //console.log("getData",getData, "initialVotesAmt",initialVotesAmt, "initialVote",initialVote)
  const session = await  getAuthSession()

  let _votesAmt = 0
  let _currentVote= undefined
  if(getData){
    const post = await getData()
    if(!post){
      return notFound()
    }
    _votesAmt =  post.votes?.reduce((acc,vote)=>{
      if(vote.type =="UP") return acc+1
      if(vote.type =="DOWN") return acc-1
      return acc
    },0)
    _currentVote = post.votes.find(vote=>vote.userId === session.user.id)
    logger.info("votesAmt",_votesAmt,"currentVote", _currentVote, "session",session)
  }else{
    logger.warn("getData is undefined")
    _votesAmt = initialVotesAmt
    _currentVote = initialVote
  }
  logger.info("votesAmt",_votesAmt,"currentVote",_currentVote,"post")
    // The only purpose of this is to enable SSR and streaming of the initial data instead of the complete client component
  return (
    <PostVoteClient
    postId={postId}
    initialVotesAmt={_votesAmt}
    initialVote={_currentVote}

    />
  )
}

export default PostVoteServer
