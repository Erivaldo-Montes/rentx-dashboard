import NextAuth from 'next-auth'
import Credencial from 'next-auth/providers/credentials'
import axios from './axios'
import { z } from 'zod'
import { cookies } from 'next/headers'
export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  pages: { signIn: '/login' },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    Credencial({
      async authorize(credentials) {
        const parserdCredentials = z
          .object({
            email: z.string(),
            password: z.string(),
          })
          .safeParse(credentials)

        if (parserdCredentials.success) {
          const { email, password } = credentials
          console.log(email, password)
          try {
            const response = await axios.post('/session', { email, password })
            if (response.status === 200) {
              // eslint-disable-next-line camelcase
              const { token, refresh_token } = response.data

              const responseProfile = await axios('/me', {
                headers: { Authorization: `Bearer ${response.data.token}` },
              })

              if (responseProfile.data) {
                const user = {
                  ...responseProfile.data,
                  accessToken: token,
                  // eslint-disable-next-line camelcase
                  refreshToken: refresh_token,
                }
                return user
              }
              return 'null'
            }
          } catch (error) {
            return null
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
      return true
    },
    async jwt({ token, user, session, trigger }) {
      if (user) {
        token.user = user
      }

      if (trigger === 'update' && session) {
        token = { ...token, ...session }
        return token
      }
      return { ...token, ...session }
    },
    async session({ session, token, user }) {
      session.user = token.user as any
      return session
    },
  },
})
