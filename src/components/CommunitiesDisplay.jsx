"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Grid,
  List,
  CheckCircle2,
  Users,
  FileText,
  Clock,
  SortAsc,
  SortDesc
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import CommunityAvatar from "@/components/CommunityAvatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { formatTimeToNow } from "@/lib/utils"

export default function CommunitiesDisplay({ 
  subscribedCommunities, 
  popularCommunities, 
  userId 
}) {
  const [displayMode, setDisplayMode] = useState("grid") // "grid" or "list"
  const [showType, setShowType] = useState("subscribed") // "subscribed", "all", or "popular"
  const [sortBy, setSortBy] = useState("name") // "name", "members", "posts", "date"
  const [sortOrder, setSortOrder] = useState("asc")
  const [searchQuery, setSearchQuery] = useState("")
  
  // Combine communities based on the selected show type
  let displayCommunities = []
  if (showType === "subscribed") {
    displayCommunities = [...subscribedCommunities]
  } else if (showType === "popular") {
    displayCommunities = [...popularCommunities]
  } else {
    // For "all", combine both and remove duplicates
    const allCommunities = [...subscribedCommunities, ...popularCommunities]
    const uniqueIds = new Set()
    displayCommunities = allCommunities.filter(community => {
      if (uniqueIds.has(community.id)) return false
      uniqueIds.add(community.id)
      return true
    })
  }
  
  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    displayCommunities = displayCommunities.filter(community => 
      community.name.toLowerCase().includes(query) || 
      (community.description && community.description.toLowerCase().includes(query))
    )
  }
  
  // Sort communities
  displayCommunities.sort((a, b) => {
    let comparison = 0
    
    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
      case "members":
        comparison = (a.memberCount || 0) - (b.memberCount || 0)
        break
      case "posts":
        comparison = (a.postCount || 0) - (b.postCount || 0)
        break
      case "date":
        comparison = new Date(a.createdAt) - new Date(b.createdAt)
        break
      default:
        comparison = a.name.localeCompare(b.name)
    }
    
    return sortOrder === "asc" ? comparison : -comparison
  })
  
  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search communities..."
            className="pl-10 w-full sm:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2 items-center">
          {/* Display type */}
          <div className="flex border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-r-none px-2.5",
                displayMode === "grid" && "bg-muted"
              )}
              onClick={() => setDisplayMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-l-none px-2.5",
                displayMode === "list" && "bg-muted"
              )}
              onClick={() => setDisplayMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Show type dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                {showType === "subscribed" && "Subscribed"}
                {showType === "popular" && "Popular"}
                {showType === "all" && "All Communities"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Show</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowType("subscribed")}>
                <CheckCircle2 className={cn("mr-2 h-4 w-4", showType === "subscribed" ? "opacity-100" : "opacity-0")} />
                Subscribed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowType("popular")}>
                <CheckCircle2 className={cn("mr-2 h-4 w-4", showType === "popular" ? "opacity-100" : "opacity-0")} />
                Popular
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowType("all")}>
                <CheckCircle2 className={cn("mr-2 h-4 w-4", showType === "all" ? "opacity-100" : "opacity-0")} />
                All Communities
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                Sort
                {sortOrder === "asc" ? (
                  <SortAsc className="ml-2 h-4 w-4" />
                ) : (
                  <SortDesc className="ml-2 h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortBy("name")}>
                <CheckCircle2 className={cn("mr-2 h-4 w-4", sortBy === "name" ? "opacity-100" : "opacity-0")} />
                Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("members")}>
                <CheckCircle2 className={cn("mr-2 h-4 w-4", sortBy === "members" ? "opacity-100" : "opacity-0")} />
                Members
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("posts")}>
                <CheckCircle2 className={cn("mr-2 h-4 w-4", sortBy === "posts" ? "opacity-100" : "opacity-0")} />
                Posts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("date")}>
                <CheckCircle2 className={cn("mr-2 h-4 w-4", sortBy === "date" ? "opacity-100" : "opacity-0")} />
                Date created
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                {sortOrder === "asc" ? "Ascending" : "Descending"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Communities list */}
      <div>
        {displayCommunities.length === 0 ? (
          <div className="text-center p-10 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">No communities found</h3>
            <p className="text-muted-foreground mb-6">
              {showType === "subscribed" 
                ? "You haven't joined any communities yet." 
                : "No communities match your search criteria."}
            </p>
            {showType === "subscribed" && (
              <Button 
                variant="outline" 
                onClick={() => setShowType("popular")}
              >
                Discover communities
              </Button>
            )}
          </div>
        ) : displayMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {displayCommunities.map((community) => (
              <CommunityCard
                key={community.id}
                community={community}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {displayCommunities.map((community) => (
              <CommunityListItem
                key={community.id}
                community={community}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CommunityCard({ community }) {
  return (
    <Link href={`/r/${community.name}`}>
      <div className="h-full border rounded-lg overflow-hidden hover:border-zinc-400 dark:hover:border-zinc-600 transition duration-200">
        <div className="bg-zinc-100 dark:bg-zinc-800 h-16 relative">
          {community.image && (
            <div className="absolute inset-0">
              <img 
                src={community.image} 
                alt={community.name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="absolute -bottom-6 left-4">
            <CommunityAvatar community={community} className="h-12 w-12 rounded-full border-2 border-white dark:border-zinc-900" />
          </div>
        </div>
        
        <div className="pt-8 px-4 pb-4">
          <h3 className="font-semibold text-lg flex items-center gap-1.5">
            r/{community.name}
            {community.isSubscribed && (
              <Badge variant="greenish" className="text-xs font-normal">Joined</Badge>
            )}
          </h3>
          
          {community.description && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 line-clamp-2">
              {community.description}
            </p>
          )}
          
          <div className="flex items-center mt-3 text-xs text-zinc-500 dark:text-zinc-400 space-x-3">
            <div className="flex items-center">
              <Users className="w-3.5 h-3.5 mr-1" />
              <span>{community.memberCount || 0} members</span>
            </div>
            <div className="flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1" />
              <span>{community.postCount || 0} posts</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function CommunityListItem({ community }) {
  return (
    <Link href={`/r/${community.name}`} className="block">
      <div className="flex items-center border rounded-lg p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition duration-200">
        <CommunityAvatar community={community} className="h-10 w-10 rounded-full mr-4" />
        
        <div className="flex-grow min-w-0">
          <div className="flex items-center">
            <h3 className="font-medium text-base">r/{community.name}</h3>
            {community.isSubscribed && (
              <Badge variant="greenish" className="ml-2 text-xs font-normal">Joined</Badge>
            )}
          </div>
          
          {community.description && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5 truncate max-w-md">
              {community.description}
            </p>
          )}
        </div>
        
        <div className="ml-4 flex flex-col items-end text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center mb-1">
            <Users className="w-3.5 h-3.5 mr-1" />
            <span>{community.memberCount || 0}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" />
            <span>{formatTimeToNow(new Date(community.createdAt))}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
