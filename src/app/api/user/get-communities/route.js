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

    // Get all communities the user is subscribed to
    const subscriptions = await db.subscription.findMany({
      where: {
        userId: userId,
      },
      include: {
        community: {
          include: {
            _count: {
              select: {
                members: true,
              },
            },
          },
        },
      },
      orderBy: {
        dateJoined: 'desc',
      },
    });

    // Extract community data
    const communities = subscriptions.map((sub) => ({
      ...sub.community,
      dateJoined: sub.dateJoined,
    }));

    logger.info(`Retrieved ${communities.length} communities for user ${userId}`);

    return new Response(JSON.stringify({ communities }), {
      status: 200,
    });
  } catch (error) {
    logger.error("Error fetching user communities", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
