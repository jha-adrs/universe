import { z } from "zod";

export const FileUploadValidator = z.object({
    file: z.any(),
    secret: z.string(),
});