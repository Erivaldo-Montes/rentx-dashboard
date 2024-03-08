import NextAuth from 'next-auth'
import { authConfig } from '../auth.config'
import Credencial from 'next-auth/providers/credentials'
import { api } from './axios'
import { cookies } from 'next/headers'
import { AUTH_REFRESH_COOKIE, AUTH_TOKEN_COOKIE } from '@/cookies/cookie-config'
import { z } from 'zod'

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  ...authConfig,
  session: {
    strategy: 'jwt',
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

          try {
            const response = await api.post('/session', { email, password })
            if (response.status === 200) {
              // eslint-disable-next-line camelcase
              const { token, refresh_token } = response.data

              cookies().set(AUTH_TOKEN_COOKIE, token)
              cookies().set(AUTH_REFRESH_COOKIE, refresh_token)

              const user = await api('/me', {
                headers: { Authorization: `Bearer ${response.data.token}` },
              })

              if (user.data) {
                return user.data
              }
              return null
            }
          } catch (error) {
            return null
          }
        }
        return null
      },
    }),
  ],
})
