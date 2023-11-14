import { db } from '@/lib/db'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { nanoid } from 'nanoid'
import { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import  EmailProvider  from 'next-auth/providers/email'
import GitHubProvider from "next-auth/providers/github";
//import { uploadFiles } from './uploadthing'

export const authOptions = {
    adapter: PrismaAdapter(db),
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/sign-in',
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                auth: {
                  user: process.env.EMAIL_SERVER_USER,
                  pass: process.env.EMAIL_SERVER_PASSWORD
                }
              },
              from: process.env.EMAIL_FROM,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    callbacks: {
        async session({ token, session }) {
            if (token) {
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture
                session.user.username = token.username
            }

            return session
        },

        async jwt({ token, user }) {
            const dbUser = await db.user.findFirst({
                where: {
                    email: token.email,
                },
            })

            if (!dbUser) {
                token.id = user?.id
                return token
            }

            if (!dbUser.username) {
                await db.user.update({
                    where: {
                        id: dbUser.id,
                    },
                    data: {
                        username: nanoid(10),
                    },
                })
            }

            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image,
                username: dbUser.username,
            }
        },
        redirect() {
            return '/'
        },
    },
}
export const getAuthSession = () =>getServerSession(authOptions)
// TODO: Get this working
// async function fetchImageAndConvertToFormData(url) {
//     const response = await fetch(url);
//     const blob = await response.blob();
  
//     // const formData = new FormData();
//     // formData.append('file', blob);
//     const [res] = await uploadFiles([blob],'imageUploader');
//     console.log(res);
//     return res.fileUrl;
//   }