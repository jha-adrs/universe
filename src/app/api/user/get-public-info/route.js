import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import _ from "lodash";

export async function POST(req) {
    try {
        const body = await req.json();
        const username = body?.username;
        if (!username) {
            return new Response(JSON.stringify({ error: "Username is required" }), {
                status: 400,
            })
        }
        logger.info("Getting public user info", username);
        // TODO: Add Cover Image
        const user = await db.user.findFirst({
            where: {
                username
            },
            select: {
                id: true,
                username: true,
                name: true,
                bio: true,
                joinedDate: true,
                image:true
            }
        });
        if (!user || !user.id) {
            logger.info("User not found", { username }, user);
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
            })
        }
        // Get top 10 public posts and comments
        const posts = await db.post.findMany({
            where: {
                authorId: user.id,
                community: {
                    visibility: "PUBLIC"
                }
            },
            orderBy: [
                { createdAt: 'desc' },
            ],
            take: 20,
            include:{
                community:true,
                author:true,
                votes:true,
                comments:true
            }
        });

        logger.info("Get public user info", { username }, { user  });

        return new Response(JSON.stringify({ user, posts }), {
            status: 200,
        })


    } catch (error) {
        logger.error("Error getting public user info", error);
        return new Response(JSON.stringify({ error: "Something went wrong" }), {
            status: 500,
        })
    }
}