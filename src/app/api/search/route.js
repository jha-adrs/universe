import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET(req){
    
    const url = new URL(req.url);
    
    const q = url.searchParams.get('q');
    logger.info("Searching for: ", q);

    if (!q) {
        return new Response(JSON.stringify({}), {status: 200});
    }

    try {
        const [communityResults, postResults, userResults] = await multiFetch(q);

        logger.info("Found communities: ", communityResults);
        logger.info("Found posts: ", postResults);
        logger.info("Found users: ", userResults);

        const results = {
            communities: communityResults,
            posts: postResults,
            users: userResults
        };

        // TODO: Also return posts, users, etc.
        return new Response(JSON.stringify(results), {status: 200});
    } catch (error) {
        logger.error("Error during search:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}

async function multiFetch(q) {
    return Promise.all([
        db.community.findMany({
            where: {
                name: {
                    startsWith: q
                }
            },
            include: {
                _count: true
            },
            take: 5
        }),
        db.post.findMany({
            where: {
                title: {
                    contains: q
                }
            },
            include: {
                _count: true,
                community: true
            },
            take: 5
        }),
        db.user.findMany({
            where: {
                username: {
                    contains: q
                }
            },
            include: {
                _count: true
            },
            take: 5
        })
    ]);
}
