import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { communitySchema } from "@/lib/validators/community";
import {logger} from '@/lib/logger';
export async function POST(req) {
    try {
        logger.info('Creating Community');
        const session = await getAuthSession();

        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 })
        }

        const body = await req.json();
        // Validate body
        const { name, description } = communitySchema.parse(body);
        const communityExists = await db.Community.findFirst({
            where: {
                name,
            }
        })
        if(communityExists) {
            return new Response("Community Exists", { status: 409 })
        }
        const community = await db.Community.create({
            data: {
                name,
                description,
                creatorId: session.user.id,
            }
        })
        logger.info(`Community Created: ${community.name} by ${session.user.username}`)
        await db.CommunitySubscription.create({
            data: {
                communityId: community.id,
                userId: session.user.id,
            }
        })

        return new Response("Community Created", { status: 200 })
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 })
    }
}