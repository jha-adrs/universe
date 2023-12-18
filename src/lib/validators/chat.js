import { z } from "zod";

export const ChatSchema = z.object({
    query: z.string(),
    stream_required: z.boolean().optional(),
})

export const ChatFeedbackSchema = z.object({
    question: z.string(),
    answer: z.string(),
    feedback: z.enum(["UP","DOWN"])
})