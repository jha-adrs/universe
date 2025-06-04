"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { toast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { accountFormSchema } from "@/lib/validators/account"
import { uploadFiles } from "@/lib/uploadthing"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { useCustomToasts } from "@/hooks/use-custom-toasts"
import { UserAvatar } from "@/components/UserAvatar"
import { Camera, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import Image from "next/image"

export function AccountForm({ user, userInfo }) {
  const router = useRouter();
  const { loginToast } = useCustomToasts();
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(userInfo?.image || null);

  const { mutate: updateAccount, isLoading } = useMutation({
    mutationFn: async (values) => {
      if (!user) throw new Error("Unauthorized");
      
      const payload = {
        username: values.username,
        bio: values.bio,
        imageUrl: values.imageUrl,
        name: values.name
      };
      
      const { data } = await axios.patch('/api/user/update-profile', payload);
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
        variant: "success"
      });
      router.refresh();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast({
            title: 'Username already taken',
            description: 'Please choose another username',
            variant: 'destructive',
          });
        }
        if (error.response?.status === 422) {
          return toast({
            title: 'Invalid input',
            description: 'Please check your inputs and try again',
            variant: 'destructive'
          });
        }
        if (error.response?.status === 401) {
          return loginToast();
        }
      }

      toast({
        title: 'Something went wrong',
        description: 'Please try again later',
        variant: 'destructive'
      });
    }
  });

  const form = useForm({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      username: userInfo?.username || "",
      name: userInfo?.name || "",
      bio: userInfo?.bio || "",
      imageUrl: userInfo?.image || "",
    },
    mode: "onChange",
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.includes("image")) {
      return toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive"
      });
    }

    setIsImageUploading(true);
    
    try {
      const [res] = await uploadFiles([file], "imageUploader");
      
      if (res?.fileUrl) {
        setPreviewUrl(res.fileUrl);
        form.setValue("imageUrl", res.fileUrl);
        
        toast({
          title: "Image uploaded",
          description: "Your profile image has been uploaded",
          variant: "success"
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image, please try again",
        variant: "destructive"
      });
    } finally {
      setIsImageUploading(false);
    }
  };

  function onSubmit(data) {
    if (isImageUploading) {
      return toast({
        title: "Image uploading",
        description: "Please wait for the image to finish uploading",
        variant: "warning",
      });
    }

    updateAccount(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative">
              <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-muted">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <UserAvatar user={user} className="h-24 w-24" />
                )}
              </div>
              
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 cursor-pointer">
                <div className="rounded-full bg-primary p-1.5 text-white shadow hover:bg-primary/90">
                  {isImageUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </div>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageUpload}
                  disabled={isImageUploading}
                />
              </label>
            </div>
            
            <div className="space-y-4 flex-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your display name" 
                        {...field} 
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormDescription>
                      This is your public display name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="username" 
                        {...field} 
                        autoComplete="off"
                        data-lpignore="true" 
                      />
                    </FormControl>
                    <FormDescription>
                      Your unique username for your profile URL. Can only contain letters, numbers, and underscores.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Card>
        
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a bit about yourself"
                  className="resize-none min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief bio to introduce yourself to the community (max 500 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading || isImageUploading}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
