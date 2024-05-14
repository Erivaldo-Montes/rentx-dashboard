'use client'

import { AppError } from '@/utils/appError'
import { useEffect } from 'react'
import axios, { axiosAuth } from '../axios'
import {
  AUTH_REFRESH_STORAGE,
  AUTH_TOKEN_STORAGE,
} from '@/storage/storage-config'
import { AxiosError } from 'axios'
import { signOutSession } from '@/app/action'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type FailedQueue = {
  onSuccess: (token: string) => void
  onFailed: (error: any) => void
}

let failedRequestQueue: FailedQueue[] = []

let isRefreshing = false

export function useAxiosAuth() {
  const route = useRouter()
  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use((config) => {
      const token = localStorage.getItem(AUTH_TOKEN_STORAGE)
      if (!config.headers.Authorization) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    })

    const responseInterceptor = axiosAuth.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          if (error.response?.data?.message === 'Unauthorized') {
            // atualizar token
            const originalConfig = error.config
            if (originalConfig) {
              if (!isRefreshing) {
                isRefreshing = true
                try {
                  const refreshToken =
                    localStorage.getItem(AUTH_REFRESH_STORAGE)
                  const tokenResponse = await axios.post('/refresh-token', {
                    refresh_token: refreshToken,
                  })

                  localStorage.setItem(
                    AUTH_TOKEN_STORAGE,
                    tokenResponse.data.token,
                  )

                  originalConfig.headers.Authorization =
                    tokenResponse.data.token

                  failedRequestQueue.forEach((request) => {
                    request.onSuccess(tokenResponse.data.token)
                  })

                  failedRequestQueue = []
                } catch (error) {
                  localStorage.clear()
                  failedRequestQueue.forEach((request) => {
                    request.onFailed(error)
                  })
                  await signOutSession()
                  route.replace('/login')
                  console.log(error)
                } finally {
                  isRefreshing = false
                }
              }

              return new Promise((resolve, reject) => {
                failedRequestQueue.push({
                  onSuccess: (token: string) => {
                    // eslint-disable-next-line dot-notation
                    originalConfig.headers['Authorization'] = `Bearer ${token}`
                    resolve(axiosAuth(originalConfig))
                  },
                  onFailed: (error) => {
                    reject(error)
                  },
                })
              })
            }
          }
        } else {
          if (error.response?.data.message) {
            console.error(error.response)
            return Promise.reject(new AppError(error.response.data.message))
          } else {
            return Promise.reject(error)
          }
        }
      },
    )

    return () => {
      axiosAuth.interceptors.response.eject(responseInterceptor)
      axiosAuth.interceptors.request.eject(requestIntercept)
    }
  }, [])

  return axiosAuth
}
