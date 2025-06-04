"use client"
import _ from 'lodash';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import UserProfileSkeleton from '@/components/skeletons/UserProfileSkeleton';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import UserProfileMain from '@/components/user/UserProfileMain';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, User, Users } from 'lucide-react';
import ProfileFeed from '@/components/feed/ProfileFeed';
import UserCommunitiesTab from '@/components/user/UserCommunitiesTab';
import UserCommentsTab from '@/components/user/UserCommentsTab';

const Page = ({ params }) => {
  const { slug } = params;
  const [isFetching, setIsFetching] = useState(true);
  const [data, setData] = useState(null);
  const { toast } = useToast();

  const { mutate: getData, isLoading } = useMutation({
    mutationFn: async () => {
      const payload = {
        username: slug
      };
      setIsFetching(true);
      const { data } = await axios.post('/api/user/get-public-info', payload);
      setData(data);
      setIsFetching(false);
    },
    onError: (err) => {
      setIsFetching(false);
      return toast({
        title: 'Error',
        description: "Could not fetch user details",
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      setIsFetching(false);
    },
  });

  useEffect(() => {
    getData();
  }, [getData, params]);

  if (isFetching || isLoading) {
    return <UserProfileSkeleton />;
  }

  return (
    <div className="flex flex-col space-y-6 w-full">
      <UserProfileMain data={data} username={slug} />
      
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-start mb-4">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Posts</span>
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Comments</span>
          </TabsTrigger>
          <TabsTrigger value="communities" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Communities</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts">
          <ProfileFeed initialPosts={data?.posts} username={slug} />
        </TabsContent>
        
        <TabsContent value="comments">
          <UserCommentsTab userId={data?.user?.id} />
        </TabsContent>
        
        <TabsContent value="communities">
          <UserCommunitiesTab userId={data?.user?.id} username={slug} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;

