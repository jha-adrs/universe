import { getAuthSession } from "@/lib/auth";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import config from "@/config/config";
import { buttonVariants } from "@/components/ui/button";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import _, { capitalize } from "lodash";
import { Users, Calendar, Info } from "lucide-react";


const Layout = async ({children, params:{slug}}) =>{
    const session = await getAuthSession();

    const community = await db.community.findFirst({
        where: {name: slug},
        include:{
            posts:{
                include:{
                    author:true,
                    votes:true
                },
                take: config.INFINITE_SCROLL_PAGINATION_AMOUNT,
            },
            creator: true,
            _count: {
                select: {
                    members: true
                }
            }
        }
    });

    if(!community){
        return notFound();
    }

    const subscription = !session?.user ? undefined : await db.subscription.findFirst({
        where:{
            community:{
                name: slug
            },
            user:{
                id: session.user.id
            }
        }
    })

    const isSubscribed = !!subscription;
    
    // Use the count from the included _count
    const memberCount = community._count.members || 0;
    
    const badgeColor = community.visibility === "PUBLIC" ? "greenish": community.visibility === "PRIVATE" ? "reddish" : "outline" ;
    
    const isOwner = community.creatorId === session?.user?.id;
    
    return (
        <div className="sm:container max-w-7xl mx-auto h-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
                <div className="flex flex-col col-span-2 space-y-6">
                    {children}
                </div>
                
                {/* Mobile-only create post button */}
                <div className="md:hidden px-4 mb-4">
                    <Link href={`/r/${community.name}/submit`} className={buttonVariants({variant:"black", className:'w-full'})}>
                        Create a post
                    </Link>
                </div>
                
                {/* About Community Sidebar */}
                <div className="hidden md:block overflow-hidden h-fit rounded-lg border-2 border-gray-200 order-first md:order-last">
                    <div className="bg-white dark:bg-zinc-800">
                        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-zinc-700">
                            <h3 className="font-semibold flex items-center">
                                <Info className="mr-2 h-4 w-4" />
                                About Community
                            </h3>
                            <Badge variant={badgeColor}>{capitalize(community.visibility)}</Badge>
                        </div>
                        
                        <div className="p-4 flex flex-col space-y-4">
                            {community.description && (
                                <p className="text-sm text-gray-700 dark:text-zinc-300">{community.description}</p>
                            )}
                            
                            <div className="flex items-center space-x-8 text-sm">
                                <div className="flex items-center space-x-1">
                                    <Users className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">{memberCount}</span>
                                    <span className="text-gray-500">members</span>
                                </div>
                                
                                <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-500">Created</span>
                                    <span className="font-medium">{format(community.createdAt, 'MMM d, yyyy')}</span>
                                </div>
                            </div>
                            
                            {isOwner ? (
                                <div className="bg-gray-50 dark:bg-zinc-900 rounded-md p-2 text-sm text-center">
                                    You own this community
                                </div>
                            ) : (
                                <SubscribeLeaveToggle subscriptionStatus={isSubscribed} communityId={community.id} />
                            )}
                            
                            {session?.user && (
                                <Link href={`/r/${community.name}/submit`} className={buttonVariants({variant:"black", className:'w-full'})}>
                                    Create a post
                                </Link>
                            )}
                            
                            {isOwner && (
                                <Link href={`/r/${community.name}/settings`} className={buttonVariants({variant:"outline", className:'w-full'})}>
                                    Manage Community
                                </Link>
                            )}
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-zinc-900 p-4 text-sm">
                        <div className="flex items-center">
                            <span className="text-gray-500 dark:text-zinc-400">Created by</span>
                            <Link href={`/u/${community.creator?.username}`} className="ml-1 font-medium text-blue-600 hover:underline">
                                u/{community.creator?.username || "unknown"}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout