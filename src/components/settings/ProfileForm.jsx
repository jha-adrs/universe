"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import {  useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast, useToast } from "@/components/ui/use-toast"
import {useRouter} from 'next/navigation'
import { profileFormSchema } from "@/lib/validators/profile"
import { uploadFiles } from "@/lib/uploadthing"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { useCustomToasts } from "@/hooks/use-custom-toasts"

export function ProfileForm({user,userInfo, ...props}) {
    const {toast} = useToast()
    const {loginToast} = useCustomToasts()
    const router = useRouter();
    const [isImageUploading, setIsImageUploading] = useState(false)
    const [imageUploadStarted, setImageUploadStarted] = useState(false)

    const{mutate:postNewProfileData} = useMutation({
        mutationFn: async ({username,imageUrl,bio}) => {
            if(!user) {return router.push('/sign-in')}
            const payload = {
                userId: user?.id,
                username,
                imageUrl,
                bio
            }
            const {data} = await axios.patch('/api/user/update-profile', payload)
            return data
        },
        onSuccess: (data) => {
            toast({
                title: "Success",
                description: "Profile updated successfully",
                variant: "success"
            })
            router.push(`/u/${data.username}`)
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {

                    return toast({
                        title: 'Username already exists!',
                        description: 'Please try another name',
                        variant: 'default',
                        
                    })
                }
                if (error.response?.status === 422) {
                    return toast({
                        title: 'Username name invalid',
                        description: 'Please try another username',
                        variant: 'destructive'
                    })
                }
                if (error.response?.status === 401) {
                    return loginToast()
                }
            }

            return toast({
                title: 'Something went wrong',
                description: 'Please try again later',
                variant: 'destructive'
            })

        }
    })

    const defaultValues = {
        bio: userInfo?.bio || "I own a computer.",
        imageUrl: '',
    }
    const form = useForm({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: "onChange",
    })
    if(!user) {return router.push('/sign-in')}
    const imageUpload = async (e) => {
        
        const file = e.target.files[0]
        if (file && file.type.includes("image")) {
            setIsImageUploading(true)
            setImageUploadStarted(true)
            const [res] = await uploadFiles([file], "imageUploader")
            console.log(res)
            toast({
                title: "Success",
                description: "Image uploaded successfully",
                variant: "success"
            
            })
            return res?.fileUrl
        }
        else{
             toast({
                title: "Error",
                description: "Please upload an image file",
                variant: "destructive"
            })
            return null
        }
}

    function onSubmit(data) {
        if (isImageUploading) {
            return toast({
                title: "Please wait",
                description: "Image is uploading",
                variant: "info",
            })
        }

        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
        postNewProfileData(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input autoComplete="off" data-lpignore="true" data-form-type="other" value={userInfo?.username} placeholder={userInfo?.username || '1234'} {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name. It can be your real name or a
                                pseudonym. You can only change this once every 30 days.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Profile Image</FormLabel>
                            <div className={`file:bg-accent grid w-full max-w-sm border-2 rounded-lg items-center gap-1.5 data-[is]: ${(isImageUploading && imageUploadStarted) ? 'border-red-600' : 'border-green-600'}`}>
                                <Input id="picture" type="file" value={''}
                                {...field}
                                onChange={async(event) => {
                                   await imageUpload(event).then((res) => {
                                        setIsImageUploading(false)
                                        setImageUploadStarted(false)
                                        form.setValue('imageUrl',res)
                                        
                                    });
                                  }}
                                 />
                            </div>

                            <FormDescription>
                                You can add your custom profile avatars{" "}
                                
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bio"
                    
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                    value={userInfo?.bio || ''}
                                    placeholder="Tell us a little bit about yourself"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                This is your public bio. Make it count.{" "}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" variant='black'>Update profile</Button>
            </form>
        </Form>
    )
}