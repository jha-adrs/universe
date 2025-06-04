import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import InteractionsClient from '@/components/interactions/InteractionsClient'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function InteractionsPage() {
  const session = await getAuthSession()

  if (!session?.user) {
    return redirect('/sign-in')
  }

  // Fetch user's posts
  const userPosts = await db.post.findMany({
    where: { 
      authorId: session.user.id 
    },
    orderBy: { 
      createdAt: 'desc' 
    },
    include: {
      community: { 
        select: { 
          id: true, 
          name: true 
        } 
      },
      votes: true,
      author: {
        select: {
          name: true,
          username: true,
          image: true,
        }
      },
      _count: {
        select: { 
          comments: true 
        }
      }
    },
    take: 50,
  })

  // Fetch user's comments
  const userComments = await db.comment.findMany({
    where: { 
      authorId: session.user.id 
    },
    orderBy: { 
      createdAt: 'desc' 
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          community: {
            select: {
              name: true,
            },
          },
        },
      },
      votes: true,
      author: {
        select: {
          name: true,
          username: true,
          image: true,
        }
      },
    },
    take: 50,
  })

  // Fetch posts upvoted by user
  const userVotes = await db.vote.findMany({
    where: { 
      userId: session.user.id 
    },
    orderBy: { 
      post: { createdAt: 'desc' } 
    },
    include: {
      post: {
        include: {
          community: { 
            select: { 
              id: true, 
              name: true 
            } 
          },
          author: {
            select: {
              name: true,
              username: true,
              image: true,
            }
          },
          votes: true,
          _count: {
            select: { 
              comments: true 
            }
          }
        }
      }
    },
    take: 50,
  })

  // Fetch comments upvoted by user
  const userCommentVotes = await db.commentVote.findMany({
    where: { 
      userId: session.user.id 
    },
    orderBy: { 
      comment: { createdAt: 'desc' } 
    },
    include: {
      comment: {
        include: {
          post: {
            select: {
              id: true,
              title: true,
              community: {
                select: {
                  name: true,
                },
              },
            }
          },
          author: {
            select: {
              name: true,
              username: true,
              image: true,
            }
          },
          votes: true,
        }
      }
    },
    take: 50,
  })

  // Format data for the client component
  const formattedPosts = userPosts.map(post => ({
    id: post.id,
    title: post.title,
    content: post.content,
    communityName: post.community.name,
    communityId: post.community.id,
    createdAt: post.createdAt,
    author: post.author,
    type: 'post',
    voteCount: post.votes.reduce((acc, vote) => {
      if (vote.type === 'UP') return acc + 1
      if (vote.type === 'DOWN') return acc - 1
      return acc
    }, 0),
    commentCount: post._count.comments,
  }))

  const formattedComments = userComments.map(comment => ({
    id: comment.id,
    text: comment.text,
    postId: comment.postId,
    postTitle: comment.post.title,
    communityName: comment.post.community.name,
    createdAt: comment.createdAt,
    author: comment.author,
    type: 'comment',
    voteCount: comment.votes.reduce((acc, vote) => {
      if (vote.type === 'UP') return acc + 1
      if (vote.type === 'DOWN') return acc - 1
      return acc
    }, 0),
  }))

  const formattedPostVotes = userVotes.map(vote => ({
    id: vote.postId,
    title: vote.post.title,
    content: vote.post.content,
    communityName: vote.post.community.name,
    communityId: vote.post.community.id,
    createdAt: vote.post.createdAt,
    author: vote.post.author,
    type: 'post_vote',
    voteType: vote.type,
    voteCount: vote.post.votes.reduce((acc, v) => {
      if (v.type === 'UP') return acc + 1
      if (v.type === 'DOWN') return acc - 1
      return acc
    }, 0),
    commentCount: vote.post._count.comments,
  }))

  const formattedCommentVotes = userCommentVotes.map(vote => ({
    id: vote.commentId,
    text: vote.comment.text,
    postId: vote.comment.postId,
    postTitle: vote.comment.post.title,
    communityName: vote.comment.post.community.name,
    createdAt: vote.comment.createdAt,
    author: vote.comment.author,
    type: 'comment_vote',
    voteType: vote.type,
    voteCount: vote.comment.votes.reduce((acc, v) => {
      if (v.type === 'UP') return acc + 1
      if (v.type === 'DOWN') return acc - 1
      return acc
    }, 0),
  }))

  // Combine all interactions
  const allInteractions = [
    ...formattedPosts,
    ...formattedComments,
    ...formattedPostVotes,
    ...formattedCommentVotes
  ]

  return (
    <div className="container max-w-7xl mx-auto py-8">
      <h1 className="font-bold text-3xl md:text-4xl mb-8">Your Interactions</h1>
      <InteractionsClient interactions={allInteractions} />
    </div>
  )
}
