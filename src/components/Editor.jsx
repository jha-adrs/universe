"use client"
import React, { useCallback, useEffect, useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import Image from "next/image"
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, LinkIcon, TextIcon, VideoIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {zodResolver}  from '@hookform/resolvers/zod'
import { PostValidator } from '@/lib/validators/post';
import { uploadFiles } from '@/lib/uploadthing';
import { toast } from './ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import {useRouter, usePathname} from 'next/navigation'
export const metadata = {
  title: "Create Post",
  description: "Create a post for your community.",
}
const Editor = ({communityId}) => {
    const pathname= usePathname ();
    const router = useRouter();
    const {
      register,
      handleSubmit,
      formState: {errors},
    } = useForm({
      resolver: zodResolver(PostValidator),
      defaultValues:{
        communityId,
        title: '',
        content:null
      }
    })
    const ref = useRef()
    const [isMounted, setIsMounted] = React.useState(false)
    const _titleRef = useRef(null)
    useEffect(()=>{
      if (typeof window !== "undefined") setIsMounted(true)



    },[])
    const initializeEditor = useCallback(async ()=>{
      const EditorJS = (await import('@editorjs/editorjs')).default
      const Header = (await import('@editorjs/header')).default
      const Embed = (await import('@editorjs/embed')).default
      const Table = (await import('@editorjs/table')).default
      const List = (await import('@editorjs/list')).default
      const Code = (await import('@editorjs/code')).default
      const LinkTool = (await import('@editorjs/link')).default
      const InlineCode = (await import('@editorjs/inline-code')).default
      const ImageTool = (await import('@editorjs/image')).default
      if(!ref.current){
        const editor  = new EditorJS({
          holder:'editor',
          onReady(){
            ref.current = editor
          },
          placeholder: 'Start sharing here!',
          inlineToolbar: true,
          data:{blocks: []},
          tools:{
            header: Header,
            linkTool: {
              class: LinkTool,
              config: {
                endpoint: '/api/link'
              },
            },
            image:{
              class: ImageTool,
              config:{
                uploader:{
                  async uploadByFile(file){
                    // Upload both in upload things as well as AWS S3
                     const [res] = await uploadFiles([file], "imageUploader")
                     return {
                        success: 1,
                        file:{
                          url: res.fileUrl,
                        }
                     }
                  }
                }
              }
            },
            list: List,
            code: Code,
            inlineCode: InlineCode,
            table: Table,
            embed: Embed
          }
        })
      }
      
    },[])

    useEffect(()=>{
      if(Object.keys(errors).length){
        for(const [_key, value] of Object.entries(errors)){
          console.log(value.message, value, _key)
          toast({
            title: 'Unexpected Error',
            description: value.message,
            variant: 'destructive'
          })
      }
    }
    }, [errors])

    useEffect(()=>{
      const init = async ()=>{
        await initializeEditor()
      }

      setTimeout(()=>{
        _titleRef.current?.focus()
      },0)
      if(isMounted){
        init()
      }
      return ()=>{
        ref.current?.destroy()
        ref.current = undefined
      }

    },[isMounted,initializeEditor])

    const {mutate: createPost} = useMutation({
      mutationFn:async ({title, content, communityId})=>{
        const payload = {communityId, title, content}

        const {data} = await axios.post('/api/community/create', payload)
        return data
      },
      onError: (err)=>{
        toast({
          title: 'Oops! Something went wrong.',
          description: "Post was not published!",
          variant: 'destructive'
        })
      },
      onSuccess: ()=>{
        const redirectURL = pathname.split('/').slice(0,-1).join('/')
        router.push(redirectURL);
        router.refresh();
        return toast({
          title: 'Success!',
          description: "Post was created!",
          variant: 'success'
        })
      }
    })


    async function onSubmit(data){
      // Save the editor data state
      console.log("onsubmit function ")
      const blocks = await ref.current?.save()

      const payload = {
        title: data.title,
        content: blocks,
        communityId    
      }
      // TODO: Remove this
      console.log(payload, data)
      createPost(payload)

    }

    if(!isMounted) return null

    const {ref: titleRef, ...rest} =  register('title')
  return (
    <div className='w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200'>
        <form id='community-post-form' className='w-fit m-5' onSubmit={handleSubmit(onSubmit)}>
          <div className="prose prose-stone dark:prose-invert">
            <TextareaAutosize 
            ref={(e)=>{
              titleRef(e)
              _titleRef.current = e
            }}
            placeholder='Title' className='w-full resize-none appearance-none overflow-hidden bg-transparent text-xl sm:text-2xl md:text-3xl font-bold focus:outline-none'/>
            <div id='editor' className='min-h-[500px] h-full w-full'/>
          </div>
        </form>
      
    </div>
  )
}

export default Editor
