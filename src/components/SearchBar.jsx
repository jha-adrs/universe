'use client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import debounce from 'lodash.debounce'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'
import { PenBox, User, Users } from 'lucide-react'


const SearchBar = ({ }) => {
    const [input, setInput] = useState('')
    const pathname = usePathname()
    const commandRef = useRef(null)
    const router = useRouter()

    useOnClickOutside(commandRef, () => {
        setInput('')
    })

    const request = debounce(async () => {
        await refetch()
    }, 300)

    const debounceRequest = useCallback(() => {
        request()
    }, [])

    const {
        isFetching,
        data: queryResults,
        refetch,
        isFetched,
    } = useQuery({
        queryFn: async () => {
            if (!input) return []
            const { data } = await axios.get(`/api/search?q=${input}`)
            return data
        },
        queryKey: ['search-query'],
        enabled: false,
    })

    useEffect(() => {
        setInput('')
    }, [pathname])

    return (
        <Command
            ref={commandRef}
            className='relative rounded-lg border max-w-lg z-50 overflow-visible'>
            <CommandInput
                onValueChange={(text) => {
                    setInput(text)
                    debounceRequest()
                }}
                value={input}
                className='outline-none border-none focus:border-none focus:outline-none ring-0'
                placeholder='Search communities, posts, and more...'
            />

            {input.length > 0 && (
                <CommandList className='absolute bg-white dark:bg-zinc-800 dark:text-white dark:border-1 border-white top-full inset-x-0 shadow rounded-b-md'>
                    {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
                    {(queryResults?.communities?.length ?? 0) > 0 ? (
                        <CommandGroup heading='Communities'>
                            {queryResults?.communities?.map((community) => (
                                <CommandItem
                                    onSelect={(e) => {
                                        router.push(`/r/${e}`)
                                        router.refresh()
                                    }}
                                    key={community.id}
                                    value={community.name}>
                                    <Users className='mr-2 h-4 w-4' />
                                    <a href={`/r/${community.name}`}>r/{community.name}</a>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    ) : null}

                    {(queryResults?.posts?.length ?? 0) > 0 ? (
                        <CommandGroup heading='Posts'>
                            {queryResults?.posts?.map((post) => (
                                <CommandItem
                                    onSelect={(e) => {
                                        router.push(`/r/${post.community.name}/post/${post.id}`)
                                        router.refresh()
                                    }}
                                    key={post.id}
                                    value={post.title}>
                                    <PenBox className='mr-2 h-4 w-4' />
                                    <a href={`/r/${post.community.name}/post/${post.id}`}>{post.title}</a>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    ) : null}


                    {(queryResults?.users?.length ?? 0) > 0 ? (
                        <CommandGroup heading='Users'>
                            {queryResults?.users?.map((users) => (
                                <CommandItem
                                    onSelect={(e) => {
                                        router.push(`/u/${e}`)
                                        router.refresh()
                                    }}
                                    key={users.id}
                                    value={users.username}>
                                    <User className='mr-2 h-4 w-4' />
                                    <a href={`/u/${users.id}`}>u/{users.username}</a>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    ) : null}

                </CommandList>
            )}
        </Command>
    )
}

export default SearchBar