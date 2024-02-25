import NextAuth from 'next-auth'
import { authConfig } from '../auth.config'
import Credencial from 'next-auth/providers/credentials'
import { api } from './axios'

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

          const response = await api.post('/session', { email, password })

          if (response.status === 401) {
            return null
          }

          if (response.status === 200) {
            const user = await api('/me', {
              headers: { Authorization: `Bearer ${response.data.token}` },
            })

            if (user.data) {
              console.log('user.data', user.data)
              return user.data
            }
            return null
          }
        }
        return null
      },
    }),
  ],
})
