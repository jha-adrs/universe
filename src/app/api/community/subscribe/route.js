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

        if(subscriptionExists){
            return new Response("Already a Member", {status: 400})
        }
        await db.subscription.create({
            data:{
                communityId,
                userId: session.user.id
            }
        })
        return new Response(communityId, {status: 200})


    } catch (error) {
        logger.error("Error in subscribing to community ", error);
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 400 })
        }

        return new Response("Could not subscribe to community", { status: 500 })
    }
}