"use client";
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { MessageSquare, Frown } from 'lucide-react';
import { formatTimeToNow } from '@/lib/utils';

const UserCommentsTab = ({ userId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const { mutate: fetchComments } = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      setLoading(true);
      const { data } = await axios.post('/api/user/get-comments', { userId });
      return data;
    },
    onSuccess: (data) => {
      setComments(data.comments || []);
      setLoading(false);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive',
      });
      setLoading(false);
    },
  });

  useEffect(() => {
    if (userId) {
      fetchComments();
    }
  }, [userId, fetchComments]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[180px]" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!comments.length) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center">
          <Frown className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No comments yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            This user hasn't made any comments yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <Card key={comment.id} className="hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
          <CardContent className="p-4">
            <Link href={`/r/${comment.post.community.name}/post/${comment.postId}`} className="block">
              <div className="flex flex-col space-y-2">
                <p className="text-xs text-gray-500">
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    r/{comment.post.community.name}
                  </span>{' '}
                  • {formatTimeToNow(new Date(comment.createdAt))}
                </p>
                <p className="text-sm font-medium">
                  Re: {comment.post.title}
                </p>
                <p className="text-sm">{comment.text}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <MessageSquare className="h-3.5 w-3.5 mr-1" />
                  <span>{comment._count?.votes || 0} votes</span>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserCommentsTab;
