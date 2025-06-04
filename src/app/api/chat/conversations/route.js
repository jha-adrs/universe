import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET(req) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Get all chat history entries for the user
    const chatHistory = await db.chathistory.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        question: true,
        answer: true,
        created_at: true,
        conversationId: true,
      },
    });

    // Group by conversationId (or create separate entries if no conversationId)
    const groupedConversations = {};
    
    chatHistory.forEach(entry => {
      const conversationId = entry.conversationId || entry.id; // Use entry ID as fallback
      
      if (!groupedConversations[conversationId]) {
        groupedConversations[conversationId] = {
          id: conversationId,
          title: entry.question || "Conversation",
          timestamp: entry.created_at,
          messages: [],
        };
      }
      
      groupedConversations[conversationId].messages.push({
        id: entry.id,
        question: entry.question,
        answer: entry.answer,
        timestamp: entry.created_at,
      });
    });

    // Convert to array and sort by latest timestamp
    const conversationsArray = Object.values(groupedConversations)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return new Response(JSON.stringify(conversationsArray), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    logger.error("Error fetching conversations:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch conversations" }),
      { status: 500 }
    );
  }
}
