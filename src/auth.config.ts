import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLogged = !!auth?.user

      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      console.log('isLogged', auth?.user)
      if (isOnDashboard) {
        if (isLogged) {
          return true
        }
        return false
      } else if (isLogged) {
        return Response.redirect(new URL('/dashboard/cars', nextUrl))
      }

      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
