import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
      });
    }

    // Get all public comments from the user
    const comments = await db.comment.findMany({
      where: {
        authorId: userId,
        post: {
          community: {
            visibility: "PUBLIC",
          },
        },
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            community: {
              select: {
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            votes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });

    logger.info(`Retrieved ${comments.length} comments for user ${userId}`);

    return new Response(JSON.stringify({ comments }), {
      status: 200,
    });
  } catch (error) {
    logger.error("Error fetching user comments", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
