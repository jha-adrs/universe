import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { z } from "zod";

export async function GET(req) {
    try {
        logger.info("GET /api/posts");
        const url = new URL(req.url);
        const session = await getAuthSession();
        let userCommunityIds = [];

        if (session) {
            const commIds = await db.subscription.findMany({
                where: {
                    userId: session.user.id,
                },
                include: {
                    community: true,
                },
            });

            userCommunityIds = await commIds.map((comm) => comm.communityId);
        }
        //console.log(userCommunityIds, "commIds");
        const { limit, page, communityName, username } = z.object({
            limit: z.string(),
            page: z.string(),
            communityName: z.string().nullish().optional(),
            username: z.string().nullish().optional(),
        }).parse({
            communityName: url.searchParams.get("communityName"),
            limit: url.searchParams.get("limit"),
            page: url.searchParams.get("page"),
            username: url.searchParams.get("username"),
        });
        logger.info("GET /api/posts", { limit, username });
        let whereClause = {};

        if (session && communityName) {
            whereClause = {
                AND: [
                    { community: { name: communityName } },
                    { community: { id: { in: userCommunityIds } } },
                ]
            };
        } else if (!session && communityName) {
            whereClause = {
                community: {
                    name: communityName,
                },
                visibility: "PUBLIC",
            };
        } else if (communityName) {
            whereClause = {
                community: {
                    name: communityName,
                },
                visibility: "PUBLIC",
            };
        } else{
            whereClause = {
                visibility: "PUBLIC",
            };
        }
        if(username){
            whereClause = {
                    authorId:username,
                    visibility:"PUBLIC"
            }
        }

        const posts = await db.post.findMany({
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            orderBy: [
                { createdAt: 'desc' },
            ],
            include: {
                community: true,
                votes: true,
                author: true,
                comments: true,
            },
            where: whereClause,
        });
        const postCount = await db.post.count({
            where: whereClause,
        });
        logger.info("GET /api/posts response", {postCount });
        return new Response(JSON.stringify(posts), {
            headers: {
                "content-type": "application/json",
            },
            status: 200,
        });
    } catch (error) {
        console.error(error);

        if (error instanceof z.ZodError) {
            return new Response(error.message, {
                status: 400,
            });
        }

        return new Response(error.message, {
            status: 500,
        });
    }
}
