import NextAuth from 'next-auth'
import Credencial from 'next-auth/providers/credentials'
import { api } from './axios'
import { z } from 'zod'

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
        const parsedCredentials = z
          .object({
            email: z.string(),
            password: z.string(),
          })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = credentials
          console.log(email, password)
          try {
            const response = await fetch('http://0.0.0.0:3333/session', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email,
                password,
              }),
            })

            const tokens = await response.json()

            console.log('response', tokens)
            if (response.status === 200) {
              // eslint-disable-next-line camelcase
              const { token, refresh_token } = tokens

              const responseProfile = await fetch('http://0.0.0.0:3333/me', {
                method: 'GET',
                headers: { Authorization: `Bearer ${tokens.token}` },
              })

              const responseProfileJson = await responseProfile.json()

              console.log(responseProfileJson)

              if (responseProfileJson) {
                const user = {
                  ...responseProfileJson,
                  accessToken: token,
                  // eslint-disable-next-line camelcase
                  refreshToken: refresh_token,
                }
                return user
              }
              return 'null'
            }
          } catch (error) {
            console.log(error)
            return null
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
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
