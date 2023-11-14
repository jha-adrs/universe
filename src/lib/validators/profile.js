import { z } from "zod";

export const profileFormSchema = z.object({
    username: z
        .string()
        .min(2, {
            message: "Username must be at least 2 characters.",
        })
        .max(30, {
            message: "Username must not be longer than 30 characters.",
        }).regex(/^[a-zA-Z0-9_.]*$/),
    bio: z.string().max(500).min(4),
    imageUrl: z
        .string()
        .url({ message: "Please enter a valid URL." })
        .optional(),
    urls: z
        .array(
            z.object({
                value: z.string().url({ message: "Please enter a valid URL." }),
            })
        )
        .optional(),
})