import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"
import { accountFormSchema } from "@/lib/validators/account"

export async function PATCH(req){
    try {
        const session = await getAuthSession()
        if(!session){
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            })
        }
        
        const body = await req.json()
        const { username, bio, imageUrl, name } = await accountFormSchema.parse(body)
        
        logger.info("Updating profile", { username, name, bio, imageUrl })
        
        // Only check for username uniqueness if it has changed
        if (username !== session.user.username) {
            const usernameExists = await db.user.findFirst({
                where:{
                    username: username,
                    NOT: {
                        id: session.user.id
                    }
                },
            })
            
            if(usernameExists){
                return new Response(JSON.stringify({ error: "Username already exists" }), {
                    status: 409,
                })
            }
        }

        await db.user.update({
            where:{
                id: session.user.id
            },
            data:{
                username,
                bio,
                name,
                image: imageUrl || undefined
            }
        })
        
        return new Response(JSON.stringify({ 
            success: true,
            username: username
        }), {
            status: 200,
        })
    } catch (error) {
        logger.error("Error updating profile", error)
        return new Response(JSON.stringify({ 
            error: "Something went wrong",
            details: error.message
        }), {
            status: error.status || 500,
        })
    }
}