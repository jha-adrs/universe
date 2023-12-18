import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { ChatFeedbackSchema } from "@/lib/validators/chat";
import { getSession } from "next-auth/react";

export async function POST(req) {
    try {
        const body = await req.json();
        logger.info("POST /api/chat/feedback", body);
        const { question, answer, feedback } = ChatFeedbackSchema.parse(body);
        if (!question || !answer || !feedback) {
            return new Response("Bad Request", { status: 400 });
        }
        const session = await getAuthSession();
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }
        const dbRes = await db.chathistory.create({
            data:{
                question,
                answer,
                feedback,
                user:{
                    connect:{
                        id: session.user.id
                    }
                }
                
            }
        });
        logger.info("POST /api/chat/feedback", dbRes, "session", session);
        return new Response("OK", { status: 200 });



    } catch (error) {
        logger.error("POST /api/chat/feedback", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}