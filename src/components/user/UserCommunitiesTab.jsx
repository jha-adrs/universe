"use client";
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import CommunityAvatar from '@/components/CommunityAvatar';
import { Users, Frown } from 'lucide-react';
import { formatTimeToNow } from '@/lib/utils';

const UserCommunitiesTab = ({ userId, username }) => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const { mutate: fetchCommunities } = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      setLoading(true);
      const { data } = await axios.post('/api/user/get-communities', { userId });
      return data;
    },
    onSuccess: (data) => {
      setCommunities(data.communities || []);
      setLoading(false);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to load communities',
        variant: 'destructive',
      });
      setLoading(false);
    },
  });

  useEffect(() => {
    if (userId) {
      fetchCommunities();
    }
  }, [userId, fetchCommunities]);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!communities.length) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center">
          <Frown className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No communities found</h3>
          <p className="mt-2 text-sm text-gray-500">
            {username} hasn't joined any communities yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {communities.map((community) => (
        <Link href={`/r/${community.name}`} key={community.id} className='mt-3'>
          <Card className="hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
            <CardContent className="p-4 flex items-center space-x-3">
              <CommunityAvatar community={community} className="h-8 w-8" />
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <h3 className="font-medium">r/{community.name}</h3>
                  <p className="text-xs text-gray-500 ">{community.description}</p>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span>{community._count?.members || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default UserCommunitiesTab;
