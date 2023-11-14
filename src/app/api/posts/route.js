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
        const { limit, page, communityName } = z.object({
            limit: z.string(),
            page: z.string(),
            communityName: z.string().nullish().optional(),
        }).parse({
            communityName: url.searchParams.get("communityName"),
            limit: url.searchParams.get("limit"),
            page: url.searchParams.get("page"),
        });

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
        } else if (session) {
            whereClause = {
                community: {
                    id: { in: userCommunityIds },
                },
            };
        }else{
            whereClause = {
                visibility: "PUBLIC",
            };
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
