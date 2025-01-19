import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { validateCredentials, validateAuthEnvironment } from '@/lib/auth'

// Validate environment variables on server start
validateAuthEnvironment()

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null
        
        if (validateCredentials(credentials)) {
          return {
            id: "1",
            name: credentials.username,
          }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.name = token.name
      }
      return session
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST } 