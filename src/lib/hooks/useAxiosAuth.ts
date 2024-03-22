'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { axiosAuth } from '../axios'
import { useRefreshToken } from './useRefreshToken'
import { AxiosError } from 'axios'
import { AppError } from '@/utils/appError'

const useAxiosAuth = () => {
  const { data: session } = useSession()
  const refreshToken = useRefreshToken()

  useEffect(() => {
    const requestInterceptor = axiosAuth.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${session?.user.accessToken}`
        }

        return config
      },
      (error) => Promise.reject(error),
    )

    const responseInterceptor = axiosAuth.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const prevRequest = error.config

        if (error.response?.status === 401 && prevRequest) {
          await refreshToken()
          prevRequest.headers.Authorization = `Bearer ${session?.user.accessToken}`

          return axiosAuth(prevRequest)
        }
        if (error.response?.data) {
          return Promise.reject(new AppError(error.response.data.message))
        }
        return Promise.reject(error)
      },
    )

    return () => {
      axiosAuth.interceptors.request.eject(requestInterceptor)
      axiosAuth.interceptors.response.eject(responseInterceptor)
    }
  }, [session, refreshToken])

  return axiosAuth
}

export default useAxiosAuth
