import { getAuthSession } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { PostValidator } from "@/lib/validators/post";
import {z} from "zod";
import { db } from "@/lib/db";
export async function POST(req) {
    try {
        const session = await getAuthSession();
        if(!session?.user){
            return new Response("Unauthorized", {status: 401})
        }
        const body = await req.json();
        console.log(body);
        const {communityId,title,content} = PostValidator.parse(body);
        const subscriptionExists = await db.subscription.findFirst({
            where:{
                communityId,
                userId: session.user.id,
                
            },
            include:{
                community: true
            }
        });

        if(!subscriptionExists){
            return new Response("You are not a Member", {status: 400})
        }
        let visibility;
        if(subscriptionExists.community.visibility){
            visibility = subscriptionExists.community.visibility === "PRIVATE" ?  "PRIVATE" :"PUBLIC"
        }
        //TODO: Add check for community visibility and add post accordingly
        logger.info("Creating post", {title, content, communityId, authorId: session.user.id})
        await db.post.create({
            data:{
                title,
                content,
                authorId: session.user.id,
                communityId,
                visibility: "PUBLIC"
            }
        })

        return new Response("OK", {status: 200})


    } catch (error) {
        logger.error("Error in posting to community ", error);
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 422 })
        }

        return new Response("Could not post to community", { status: 500 })
    }
}