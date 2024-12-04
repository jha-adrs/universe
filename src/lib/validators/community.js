import { z } from "zod"; 

export const communitySchema = z.object({
    name: z.string().min(3).max(50).refine(name => /^[a-z0-9-_]+$/.test(name), {
        message: "Name must be URL compatible (lowercase letters, numbers, and hyphens only)",
      }),
    description: z.string().min(1).max(2055),
    visibility: z.enum(["PUBLIC","PRIVATE","RESTRICTED"])
});

export const CommunitySubscriptionValidator = z.object({
    communityId: z.string()
});

// TODO See if schema is needed for this