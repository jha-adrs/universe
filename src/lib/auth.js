import { db } from "./db"
import {PrismaAdapter} from '@next-auth/prisma-adapter'
import { nanoid } from "nanoid"
import GoogleProvider from 'next-auth/providers/google'
// TODO: Add more providers here
export const authOptions ={
    adapter: PrismaAdapter(db),
    session:{
        strategy: 'jwt'
    },
    pages:{
        signIn:'sign-in',
        signOut:'sign-out',

    },
    providers:[
        GoogleProvider({
            clientId:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks:{
        async session({session,token, user}){
            if(token){
                session.user.id = token.id
                session.user.username = token.username
                session.user.email = token.email
                session.user.image = token.image
                session.user.name = token.name 
                // TODO: Add instiutional email check here or in the provider
                session.user.institutionalEmail = token.institutionalEmail
            }
            return session;
        },
        async jwt({token,user}){
            const dbUser = await db.user.findFirst({
                where:{
                    email: token.email
                }
            })
            if(!dbUser){
                token.id =  user?.id
                return token
            }
            if(!dbUser.username){
                await db.user.update({
                    where:{
                        id:dbUser.id
                    },
                    data:{
                        username: nanoid(10)
                    }
                })
            }
            return {
                id: dbUser.id,
                username: dbUser.username,
                email: dbUser.email,
                image: dbUser.image,
                name: dbUser.name,
                institutionalEmail: dbUser.institutionalEmail
            }
        },
        redirect(){
            return '/'
        }
}
}








