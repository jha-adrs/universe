import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"
import { profileFormSchema } from "@/lib/validators/profile"

export async function PATCH(req){
    try {
        
    const session = await getAuthSession()
    if(!session){
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        })
    }
    const body = await req.json()
    const { username, bio,imageUrl } = await profileFormSchema.parse(body)
    logger.info("Updating profile", { username, bio,imageUrl })
    const usernameExists = await db.user.findFirst({
        where:{
            username:username
         },
    
    })
    if(usernameExists){
        return new Response(JSON.stringify({ error: "Username already exists" }), {
            status: 409,
        })
    }

    await db.user.update({
        where:{
            id:session.user.id
        },
        data:{
            username,
            bio,
            image:imageUrl
        }
        
    })
    return new Response(JSON.stringify({ success: true }), {
        status: 200,
    })

    } catch (error) {
        logger.error("Error updating profile", error)
        return new Response(JSON.stringify({ error: "Something went wrong" }), {
            status: 500,
        })
    }

}  