import { z } from "zod"; 

export const commentSchema = z.object({
    postId: z.string(),
    text: z.string().min(1).max(255),
    replyToId: z.string().optional()
});
