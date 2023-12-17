import { z } from "zod";

export const ChatSchema = z.object({
    query: z.string(),
    stream_required: z.boolean().optional(),
})