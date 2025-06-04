import { z } from "zod";

export const ChatSchema = z.object({
    query: z.string(),
    stream: z.boolean().optional(),
    conversationId: z.string().optional(),
    context: z.object({
        questions: z.array(z.string()).optional(),
        answers: z.array(z.string()).optional(),
    }).optional(),
});

export const ChatFeedbackSchema = z.object({
    question: z.string(),
    answer: z.string(),
    feedback: z.enum(["UP","DOWN"])
});