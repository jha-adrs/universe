import { z } from "zod"; 

export const communitySchema = z.object({
    communityName: z.string().min(3).max(50),
    communityDescription: z.string().min(1).max(255),
});

export const CommunitySubscriptionValidator = z.object({
    
});