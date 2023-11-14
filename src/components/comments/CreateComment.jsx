"use client"
import React, { useState } from 'react'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import DOMPurify from 'dompurify'
import { useToast } from '@/components/ui/use-toast'
import {useCustomToasts} from '@/hooks/use-custom-toasts'
import {useRouter} from 'next/navigation'
import { Loader2 } from 'lucide-react'
// Add GIF, and other rich text options
const CreateComment = ({ postId, user,replyToId, ...props }) => {
    const {toast} = useToast()
    const {loginToast} = useCustomToasts();
    const [input, setInput] = useState('');
    const router = useRouter();
    const {mutate:createComment, isLoading} = useMutation({
        mutationFn: async()=>{
            setInput(DOMPurify.sanitize(input))

            const payload = {
                postId,
                text:input,
                replyToId
            }
            const {data} = await axios.patch(`/api/community/post/comment`,payload)
            console.log(data)
            return data;
        },
        onError: (err) => {
            if(err instanceof AxiosError){
                if(err.response?.status === 401){
                    return loginToast()
                }
            }
            return toast({
              title: 'Oops! Something went wrong.',
              description:  err?.response.data||"Comment was not published!",
              variant: 'destructive'
            })
          },
          onSuccess: () => {
            router.refresh();
            setInput('')
            return toast({
              title: 'Success!',
              description: "Comment was created!",
              variant: 'success'
            })
          }

    })


    return (
        <div className='grid w-full gap-1.5'>
            <Label htmlFor='comment' className='text-sm font-medium'>
                Comment as {user?.username}
            </Label>
            <div className="mt-2">
                <Textarea
                    id="comment"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={1}
                    placeholder='Your comment here'
                />

                <div className="mt-2 flex justify-end">
                    <Button variant='black' onClick={createComment} disabled={isLoading}>
                        {isLoading ? <Loader2 className='animate-spin'/> : 'Comment'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CreateComment
