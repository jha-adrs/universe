"use client"
import { Card, CardContent } from "@/components/ui/card"
import UserAvatar from "../UserAvatar"
import { Calendar, Star } from "lucide-react"
import { Badge } from "../ui/badge"
import { format } from "date-fns"

export default function UserProfileMain({ data, username }) {
  const user = data?.user;
  if (!user) return null;
  
  const joinedDate = new Date(user.joinedDate);
  const formattedDate = format(joinedDate, 'MMMM d, yyyy');
  
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <UserAvatar user={user} className="h-12 w-12 rounded-full" />
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="font-bold text-xl md:text-2xl">{user.name}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">u/{user.username}</p>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <Badge variant="outline" className="flex items-center gap-1 px-2">
                  <Star className="h-3.5 w-3.5 text-yellow-500" />
                  <span>{user.karma || 0} karma</span>
                </Badge>
                
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  <span>Joined {formattedDate}</span>
                </div>
              </div>
            </div>
            
            {user.bio && (
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{user.bio}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
