import { getAuthSession } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { CommunitySubscriptionValidator } from "@/lib/validators/community";
import {z} from "zod";
import { db } from "@/lib/db";
export async function POST(req) {
    try {
        const session = await getAuthSession();
        if(!session?.user){
            return new Response("Unauthorized", {status: 401})
        }
        const body = await req.json();
        const {communityId} = CommunitySubscriptionValidator.parse(body);
        const subscriptionExists = await db.subscription.findFirst({
            where:{
                community:{
                    id: communityId
                },
                user:{
                    id: session.user.id
                }
            }
        });

        if(!subscriptionExists){
            return new Response("Not a Member", {status: 400})
        }
        // Check if the user is the owner of the community
        const community = await db.community.findFirst({
            where:{
                id: communityId,
                creatorId: session.user.id
            }
        });
        if(community){
            return new Response("Owner cannot leave the community", {status: 407})
        }

        await db.subscription.delete({
            where:{
                userId_communityId:{
                    communityId: communityId,
                    userId: session.user.id
                }
            }
        })

        return new Response(communityId, {status: 200})


    } catch (error) {
        logger.error("Error in leaving community ", error);
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 400 })
        }

        return new Response("Could not leave the community", { status: 500 })
    }
}