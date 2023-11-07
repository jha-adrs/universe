import { getAuthSession } from "@/lib/auth";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import config from "@/config/config";
import { Button, buttonVariants } from "@/components/ui/button";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import _, { capitalize } from "lodash";
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

    const memberCount = await db.subscription.count({
        where:{
            community:{
                name: slug
            },
        }
    })
    const badgeColor = community.visibility === "PUBLIC" ? "greenish": community.visibility === "PRIVATE" ? "reddish" : "outline" ;
    return (
        <div className="sm:container max-w-7xl mx-auto h-full pt-12">
            <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
                    <div className="flex flex-col col-span-2 space-y-6">
                    {children}
                    </div>

                    <div className="hidden md:block overflow-hidden h-fit rounded-lg border-2 border-gray-200 order-first md:order-last">
                        <div className="px-6 py-4 justify-between flex flex-row ">
                            <p className=" font-semibold py-3">About  r/{community.name}</p>
                            <Badge variant={badgeColor} className="mb-4 h-5">{capitalize(community.visibility)}</Badge>
                        </div>
                        <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white ">
                            <div className="flex justify-between gap-x-4 py-3">
                                <dt className="text-gray-500">Created</dt>
                                <dd className="text-gray-700"><time dateTime={community.createdAt.toDateString()}>{format(community.createdAt,'MMMM d, yyyy')}</time></dd>
                                
                            </div>

                            <div className="flex justify-between gap-x-4 py-3">
                                <dt className="text-gray-500">Members</dt>
                                <dd className="text-gray-700">{memberCount}</dd>
                                
                            </div>
                            <div className="flex justify-between gap-x-4 py-3">
                                <dt className="text-gray-500">Description</dt>
                                <dd className="text-gray-700">{community.description}</dd>
                                
                            </div>
                            {community.creatorId === session?.user?.id ? (<div className="flex justify-between gap-x-4 py-3">
                                <p>You own this community</p>
                            </div>):(null)}
                            {community.creatorId !== session?.user?.id ? (<SubscribeLeaveToggle subscriptionStatus={isSubscribed} communityId ={community.id }/>):(null)}
                            <Link href={`/r/${community.name}/submit`} className={buttonVariants({variant:"black", className:'w-full mb-6'})}>
                                Create a post
                            </Link>
                        </dl>

                    </div>
                </div>
                
            </div>
        
        </div>
    )
}

export default Layout