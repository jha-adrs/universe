"use client"

import { Card } from "@/components/ui/card";
import CommunityAvatar from "@/components/CommunityAvatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Camera, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { capitalize } from "lodash";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { getRandomGradient } from "@/lib/utils";

const CommunityHeader = ({ community, subscriptionStatus, isOwner, session, memberCount }) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const badgeColor = community.visibility === "PUBLIC" ? "greenish" 
    : community.visibility === "PRIVATE" ? "reddish" 
    : "outline";

  // Get a gradient based on the community name for consistent appearance
  const headerGradient = getRandomGradient(community.name);
  
  // Ensure member count is a valid number
  const displayMemberCount = typeof memberCount === 'number' ? memberCount : community._count?.members || 0;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleAvatarUpdate = () => {
    // This is just a placeholder for now - we'll implement the actual upload API later
    setIsUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      setOpen(false);
      toast({
        title: "Avatar updated",
        description: "Your community avatar has been updated successfully",
      });
    }, 1500);
  };

  return (
    <Card className="overflow-hidden">
      <div className={`h-24 ${headerGradient}`}></div>
      
      <div className="p-4 flex items-start relative">
        <div className="relative -mt-12 mr-4">
          <CommunityAvatar 
            community={community} 
            className="h-16 w-16 border-4 border-white dark:border-zinc-900 rounded-full"
          />
          {isOwner && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="absolute -bottom-1 -right-1 rounded-full h-6 w-6 bg-white dark:bg-zinc-800 shadow hover:bg-gray-100"
                >
                  <Camera className="h-3.5 w-3.5" />
                </Button>
              </DialogTrigger>
              
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Community Avatar</DialogTitle>
                  <DialogDescription>
                    Upload a new avatar for r/{community.name}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="flex flex-col items-center space-y-4 py-4">
                  <div className="relative w-32 h-32">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <CommunityAvatar
                        community={community}
                        className="w-32 h-32 rounded-full"
                      />
                    )}
                  </div>
                  
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="avatar">Select Image</Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAvatarUpdate} 
                    disabled={!selectedFile || isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <div className="flex items-center">
                <h1 className="text-2xl font-bold mr-2">r/{community.name}</h1>
                <Badge variant={badgeColor}>{capitalize(community.visibility)}</Badge>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Users className="h-4 w-4 mr-1" />
                <span>{displayMemberCount} members</span>
              </div>
            </div>
            
            {session?.user && !isOwner && (
              <div className="mt-3 sm:mt-0">
                <SubscribeLeaveToggle
                  subscriptionStatus={subscriptionStatus}
                  communityId={community.id}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CommunityHeader;
