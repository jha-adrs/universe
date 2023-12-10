"use client"
import _ from 'lodash';

import { useMutation } from '@tanstack/react-query';

import { useEffect, useState } from 'react';
import UserProfileSkeleton from '@/components/skeletons/UserProfileSkeleton';

import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import UserProfileMain from '@/components/user/UserProfileMain';
const Page = ({ params, session }) => {
  const { slug } = params;
  const [isFetching, setIsFetching] = useState(true)
  const [data, setData] = useState(null)
  const toast = useToast();
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
        message: "Could not fetch, user details",
        type: 'destructive',
      })
    },
    onSuccess: (data) => {
      setIsFetching(false);
      console.log(data);
    },
  })
  useEffect(() => {
    getData();
  }, [params])
  return (
    <>
      {(isFetching || isLoading) ? <UserProfileSkeleton /> : <UserProfileMain data={data} username={slug}/>}
    </>
  )
}

export default Page

