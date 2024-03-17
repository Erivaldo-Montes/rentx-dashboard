'use client'

import { useSession } from 'next-auth/react'
import axios from '../axios'

export const useRefreshToken = () => {
  const { data: session } = useSession()

  const refreshToken = async () => {
    const res = await axios.post('/refresh-token', {
      refresh_token: session?.user.refreshToken,
    })

    if (session) session.user.accessToken = res.data.token
  }

  return refreshToken
}
