import config from "@/config/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { commentSchema } from "@/lib/validators/comment";
import { ZodError } from "zod";

export async function PATCH(req){
    try {
        const body = await req.json()
        const { postId, text, replyToId } = commentSchema.parse(body);
        const session = await getAuthSession();
        logger.info("Creating Comment", { postId, text, replyToId, session })
        if(!session?.user) return new Response("Unauthorized", { status: 401 });
        // TODO: Check if comments already exists, if comments are allowed, and no of comments is less than 10 
        const previousComments = await db.comment.aggregate({
            _count:{
                _all:true,
            },
            where:{
                postId,
                authorId: session.user.id,
            }
        })
        logger.info(previousComments, "previousComments");
        if(previousComments._count._all > config.MAX_COMMENTS_PER_POST_PER_USER) return new Response("You have reached the maximum number of comments allowed", { status: 400 });
        const dbResponse = await db.comment.create({
            data:{
                text,
                postId,
                authorId: session.user.id,
                replyToId,
            }
        })
        return new Response('OK', { status: 200 });

    } catch (error) {
        logger.error(error);
        if(error instanceof ZodError){
            return new Response(error.message, { status: 400 });
        }
        return new Response("Could not post your comment, please try again later", { status: 500 });

    }
}