import { z } from "zod"; 

export const communitySchema = z.object({
    name: z.string().min(3).max(50),
    description: z.string().min(1).max(255),
});

export const CommunitySubscriptionValidator = z.object({
    communityId: z.string()
});

// TODO See if schema is needed for this