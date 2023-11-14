import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET(req){
    
    const url = new URL(req.url);
    
    const q = url.searchParams.get('q');
    logger.info("Searching for: ",q);
    if(!q) {
        return new Response(JSON.stringify({}), {status: 200})
    }
    const communityResults = await db.community.findMany({
        where:{
            name:{
                startsWith: q
            }
        },
        include:{
            _count:true
        },
        take: 5
    })
    const postResults = await db.post.findMany({
        where:{
            title:{
                contains: q
            }
        },
        include:{
            _count:true,
            community:true
        },
        take: 5
    })
    logger.info("Found communities: ", communityResults);
    logger.info("Found posts: ", postResults);

    const results = {
        communities: communityResults,
        posts: postResults
    }
    // TODO: Also return posts, users, etc.
    return new Response(JSON.stringify(results), {status: 200})


}