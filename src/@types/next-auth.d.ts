import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      password: string
      role: 'ADMIN' | 'USER'
      driver_license: string
      avatar: string
      created_at: Date
      refreshToken: string
      accessToken: string
    }
  }
}
