import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { communitySchema } from "@/lib/validators/community";
import { logger } from '@/lib/logger';
import { z } from "zod";
// Use caching to get user session
export async function POST(req) {
    try {
        logger.info('Create Community Request');
        const session = await getAuthSession();

        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 })
        }

        const body = await req.json();
        // Validate body
        const { name, description, visibility } = communitySchema.parse(body);
        logger.info(`Community Creation request : ${name} by ${session.user.username}`)
        const communityExists = await db.Community.findFirst({
            where: {
                name,
            }
        })
        if (communityExists) {
            logger.warn(`Community Creation Request Rejected: ${communityExists.name}`)
            return new Response("Community Exists", { status: 409 })
        }
        const community = await db.Community.create({
            data: {
                name,
                description,
                creatorId: session.user.id,
                visibility: visibility
            }
        })
        logger.info(`Community Created: ${community.name} by ${session.user.username}`)
        const response = await db.subscription.create({
            data: {
                communityId: community.id,
                userId: session.user.id,
            }
        })
        logger.info(`Community Subscription Created: ${community.name} by ${session.user.username}`)

        return new Response(community.name, { status: 201 })
    } catch (error) {
        logger.error("Error in creating new community ", error);
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 400 })
        }

        return new Response("Could not create community", { status: 500 })
    }
}