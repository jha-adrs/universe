"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { 
  ArrowDown, 
  ArrowUp, 
  CalendarIcon, 
  ChevronDown, 
  Filter, 
  MessageSquare, 
  RefreshCw, 
  ThumbsDown, 
  ThumbsUp
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { formatTimeToNow } from "@/lib/utils"
import Link from "next/link"
import UserAvatar from "../UserAvatar"
import { cn } from "@/lib/utils"

export default function InteractionsClient({ interactions }) {
  const [filteredInteractions, setFilteredInteractions] = useState([])
  const [activeTab, setActiveTab] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Sort and filter interactions whenever dependencies change
  useEffect(() => {
    let results = [...interactions]
    
    // Filter by type
    if (activeTab !== "all") {
      results = results.filter(item => {
        if (activeTab === "posts") return item.type === "post"
        if (activeTab === "comments") return item.type === "comment"
        if (activeTab === "votes") return item.type === "post_vote" || item.type === "comment_vote"
        if (activeTab === "upvotes") return (item.type === "post_vote" || item.type === "comment_vote") && item.voteType === "UP"
        if (activeTab === "downvotes") return (item.type === "post_vote" || item.type === "comment_vote") && item.voteType === "DOWN"
        return true
      })
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      results = results.filter(item => {
        if (item.title && item.title.toLowerCase().includes(term)) return true
        if (item.text && item.text.toLowerCase().includes(term)) return true
        if (item.communityName && item.communityName.toLowerCase().includes(term)) return true
        if (item.postTitle && item.postTitle.toLowerCase().includes(term)) return true
        return false
      })
    }
    
    // Filter by date range
    if (dateRange.from) {
      results = results.filter(item => {
        const itemDate = new Date(item.createdAt)
        return itemDate >= dateRange.from
      })
    }
    
    if (dateRange.to) {
      results = results.filter(item => {
        const itemDate = new Date(item.createdAt)
        return itemDate <= dateRange.to
      })
    }
    
    // Sort interactions
    results.sort((a, b) => {
      const dateA = new Date(a.createdAt)
      const dateB = new Date(b.createdAt)
      
      if (sortOrder === "newest") {
        return dateB - dateA
      } else {
        return dateA - dateB
      }
    })
    
    setFilteredInteractions(results)
    setCurrentPage(1) // Reset to first page when filters change
  }, [interactions, activeTab, sortOrder, searchTerm, dateRange])
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredInteractions.length / itemsPerPage)
  const paginatedInteractions = filteredInteractions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  
  // Handle pagination
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }
  
  const resetFilters = () => {
    setActiveTab("all")
    setSortOrder("newest")
    setSearchTerm("")
    setDateRange({ from: undefined, to: undefined })
  }
  
  return (
    <div className="space-y-6">
      {/* Filters section */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center justify-between">
          <div className="flex-1">
            <Input
              placeholder="Search interactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            
            
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="h-8 w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={resetFilters} 
              title="Reset filters"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 lg:w-[600px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="votes">All Votes</TabsTrigger>
            <TabsTrigger value="upvotes">Upvotes</TabsTrigger>
            <TabsTrigger value="downvotes">Downvotes</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {filteredInteractions.length > 0 ? (
          <p>Showing {paginatedInteractions.length} of {filteredInteractions.length} interactions</p>
        ) : (
          <p>No interactions found matching your filters</p>
        )}
      </div>
      
      {/* Interactions list */}
      <div className="space-y-4">
        {paginatedInteractions.length > 0 ? (
          paginatedInteractions.map((interaction) => (
            <InteractionCard key={`${interaction.type}-${interaction.id}`} interaction={interaction} />
          ))
        ) : (
          <div className="border rounded-lg p-8 text-center">
            <h3 className="font-semibold mb-2">No interactions found</h3>
            <p className="text-muted-foreground mb-4">
              {filteredInteractions.length === 0 && interactions.length > 0 ? 
                "Try adjusting your filters" :
                "You haven't made any interactions yet"
              }
            </p>
            {filteredInteractions.length === 0 && interactions.length > 0 && (
              <Button variant="outline" onClick={resetFilters}>
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {filteredInteractions.length > itemsPerPage && (
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={prevPage} 
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <Button 
            variant="outline" 
            onClick={nextPage} 
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

const InteractionCard = ({ interaction }) => {
  // Render different cards based on interaction type
  switch (interaction.type) {
    case 'post':
      return <PostInteractionCard interaction={interaction} />
    case 'comment':
      return <CommentInteractionCard interaction={interaction} />
    case 'post_vote':
      return <VoteInteractionCard interaction={interaction} />
    case 'comment_vote':
      return <CommentVoteInteractionCard interaction={interaction} />
    default:
      return null
  }
}

const PostInteractionCard = ({ interaction }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <Link 
              href={`/r/${interaction.communityName}/post/${interaction.id}`}
              className="font-semibold text-lg hover:underline"
            >
              {interaction.title}
            </Link>
            <div className="text-sm text-muted-foreground mt-1">
              <Badge variant="outline" className="mr-2">You posted</Badge>
              <Link href={`/r/${interaction.communityName}`} className="hover:underline">
                r/{interaction.communityName}
              </Link>
              <span className="mx-2">•</span>
              <span title={new Date(interaction.createdAt).toLocaleString()}>
                {formatTimeToNow(new Date(interaction.createdAt))}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3 pt-0">
        {interaction.content && typeof interaction.content === 'object' && (
          <div className="text-sm line-clamp-2">
            {interaction.content.type === 'doc' 
              ? interaction.content.content?.[0]?.content?.[0]?.text || 'No content' 
              : 'Content available'}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <div className="flex items-center">
            <ThumbsUp className="h-4 w-4 mr-1" /> 
            <span>{interaction.voteCount} votes</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" /> 
            <span>{interaction.commentCount} comments</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

const CommentInteractionCard = ({ interaction }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <Link 
              href={`/r/${interaction.communityName}/post/${interaction.postId}`}
              className="font-medium hover:underline"
            >
              RE: {interaction.postTitle}
            </Link>
            <div className="text-sm text-muted-foreground mt-1">
              <Badge variant="outline" className="mr-2">Your comment</Badge>
              <Link href={`/r/${interaction.communityName}`} className="hover:underline">
                r/{interaction.communityName}
              </Link>
              <span className="mx-2">•</span>
              <span title={new Date(interaction.createdAt).toLocaleString()}>
                {formatTimeToNow(new Date(interaction.createdAt))}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3 pt-0">
        <div className="text-sm line-clamp-3">{interaction.text}</div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <div className="flex items-center">
            <ThumbsUp className="h-4 w-4 mr-1" /> 
            <span>{interaction.voteCount} votes</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

const VoteInteractionCard = ({ interaction }) => {
  return (
    <Card className={cn(
      interaction.voteType === "UP" ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"
    )}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <Link 
              href={`/r/${interaction.communityName}/post/${interaction.id}`}
              className="font-medium hover:underline"
            >
              {interaction.title}
            </Link>
            <div className="text-sm text-muted-foreground mt-1">
              <Badge 
                variant={interaction.voteType === "UP" ? "greenish" : "reddish"} 
                className="mr-2"
              >
                {interaction.voteType === "UP" ? "You upvoted" : "You downvoted"}
              </Badge>
              <Link href={`/r/${interaction.communityName}`} className="hover:underline">
                r/{interaction.communityName}
              </Link>
              <span className="mx-2">•</span>
              <Link href={`/u/${interaction.author.username}`} className="hover:underline flex items-center inline-flex">
                <UserAvatar 
                  user={interaction.author}
                  className="h-3 w-3 mr-1"
                />
                {interaction.author.username}
              </Link>
              <span className="mx-2">•</span>
              <span title={new Date(interaction.createdAt).toLocaleString()}>
                {formatTimeToNow(new Date(interaction.createdAt))}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3 pt-0">
        {interaction.content && typeof interaction.content === 'object' && (
          <div className="text-sm line-clamp-2">
            {interaction.content.type === 'doc' 
              ? interaction.content.content?.[0]?.content?.[0]?.text || 'No content' 
              : 'Content available'}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <div className="flex items-center">
            <ThumbsUp className="h-4 w-4 mr-1" /> 
            <span>{interaction.voteCount} votes</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" /> 
            <span>{interaction.commentCount} comments</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

const CommentVoteInteractionCard = ({ interaction }) => {
  return (
    <Card className={cn(
      interaction.voteType === "UP" ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"
    )}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <Link 
              href={`/r/${interaction.communityName}/post/${interaction.postId}`}
              className="font-medium hover:underline"
            >
              RE: {interaction.postTitle}
            </Link>
            <div className="text-sm text-muted-foreground mt-1">
              <Badge 
                variant={interaction.voteType === "UP" ? "greenish" : "reddish"} 
                className="mr-2"
              >
                {interaction.voteType === "UP" ? "You upvoted comment" : "You downvoted comment"}
              </Badge>
              <Link href={`/r/${interaction.communityName}`} className="hover:underline">
                r/{interaction.communityName}
              </Link>
              <span className="mx-2">•</span>
              <Link href={`/u/${interaction.author.username}`} className="hover:underline flex items-center inline-flex">
                <UserAvatar 
                  user={interaction.author} 
                  className="h-3 w-3 mr-1"
                />
                {interaction.author.username}
              </Link>
              <span className="mx-2">•</span>
              <span title={new Date(interaction.createdAt).toLocaleString()}>
                {formatTimeToNow(new Date(interaction.createdAt))}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3 pt-0">
        <div className="text-sm line-clamp-3">{interaction.text}</div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <div className="flex items-center">
            <ThumbsUp className="h-4 w-4 mr-1" /> 
            <span>{interaction.voteCount} votes</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
