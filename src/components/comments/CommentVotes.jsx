'use client'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { PostVoteRequest } from '@/lib/validators/vote'
import { usePrevious } from '@mantine/hooks'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'


const CommentVotes = ({
    commentId,
    initialVotesAmt,
    initialVote,
}) => {
    const { loginToast } = useCustomToasts()
    const [votesAmt, setVotesAmt] = useState(initialVotesAmt)
    const [currentVote, setCurrentVote] = useState(initialVote?.type)
    const prevVote = usePrevious(currentVote)

    useEffect(() => {
        setCurrentVote(initialVote)
    }, [initialVote])
    const { mutate: vote, isLoading } = useMutation({
        mutationFn: async (type) => {
            const payload = {
                commentId,
                voteType: type
            }
            const { data } = await axios.patch(`/api/community/post/comment/vote`, payload)
            return data;
        },
        onError: (err, voteType) => {
            if (voteType === 'UP') setVotesAmt((prev) => prev - 1)
            else setVotesAmt((prev) => prev + 1)

            // reset current vote
            setCurrentVote(prevVote)

            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast()
                }
            }

            return toast({
                title: 'Something went wrong.',
                description: "Your vote was not registered. Please try again.",
                variant: 'destructive',
            })
        },
        onMutate: (type) => {
            if (currentVote?.type === type) {
                // User is canceling their vote
                setCurrentVote(null);
                if (type === 'UP') setVotesAmt((prev) => prev - 1); // Increase total vote count by 1 for upvote
                else if (type === 'DOWN') setVotesAmt((prev) => prev + 1); // Decrease total vote count by 1 for downvote

            } else if (!currentVote?.type) {
                // User is voting for the first time
                setCurrentVote({ ...currentVote, type: type });
                if (type === 'UP') setVotesAmt((prev) => prev + 1); // Increase total vote count by 1 for upvote
                else if (type === 'DOWN') setVotesAmt((prev) => prev - 1); // Decrease total vote count by 1 for downvote
            } else {
                // User is changing their vote
                setCurrentVote({ ...currentVote, type: type });
                if (type === 'UP') {
                    // If the previous vote was a downvote, increase total vote count by 2
                    // If the previous vote was an upvote, increase total vote count by 1
                    setVotesAmt((prev) => prev + (prevVote?.type === 'DOWN' ? 2 : 1));
                } else if (type === 'DOWN') {
                    // If the previous vote was an upvote, decrease total vote count by 2
                    // If the previous vote was a downvote, decrease total vote count by 1
                    setVotesAmt((prev) => prev - (prevVote?.type === 'UP' ? 2 : 1));
                }
            }
        },
    })

    return (
        <div className='flex flex-row  gap-1 sm:gap-0  sm:w-20 pb-4 sm:pb-0'>
            {/* upvote */}
            <Button
                onClick={() => vote('UP')}
                size='sm'
                variant='ghost'
                aria-label='upvote'
                disabled={isLoading}>
                <ArrowBigUp
                    className={cn('h-5 w-5 text-zinc-700 dark:text-white', {
                        'text-emerald-500 fill-emerald-500': currentVote?.type === 'UP',
                    })}
                />
            </Button>

            {/* score */}
            <p className='text-center py-2 font-bold text-sm text-zinc-900 dark:text-zinc-50'>
                {votesAmt}
            </p>

            {/* downvote */}
            <Button
                onClick={() => vote('DOWN')}
                size='sm'
                className={cn({
                    'text-emerald-500': currentVote?.type === 'DOWN',
                })}
                variant='ghost'
                aria-label='downvote'
                disabled={isLoading}>
                <ArrowBigDown
                    className={cn('h-5 w-5 text-zinc-700 dark:text-white', {
                        'text-red-500 fill-red-500': currentVote?.type === 'DOWN',
                    })}
                />
            </Button>
        </div>
    )
}

export default CommentVotes