const { default: NextAuth } = require("next-auth/next");
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}