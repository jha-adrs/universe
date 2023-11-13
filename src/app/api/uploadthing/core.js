import { logger } from "@/lib/logger";
import { createUploadthing } from "uploadthing/next";
 
const f = createUploadthing();
 
const auth = (req) => ({ id: "fakeId" }); // Fake auth function
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" }, video: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
        logger.info("middleware", req , f);
      const user = await auth(req);
      if (!user) throw new Error("Unauthorized");
      
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      logger.info("Upload complete for userId:", metadata.userId );
      logger.info("file url", file.url);
    }),
    
} ;