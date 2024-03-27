'use client'

import { AppError } from '@/utils/appError'
import { useEffect } from 'react'
import axios, { axiosAuth } from '../axios'
import {
  AUTH_REFRESH_STORAGE,
  AUTH_TOKEN_STORAGE,
} from '@/storage/storage-config'
import { AxiosError } from 'axios'
import { signOut } from 'next-auth/react'
type FailedQueue = {
  onSuccess: (token: string) => void
  onFailed: (error: any) => void
}

let failedRequestQueue: FailedQueue[] = []

let isRefreshing = false

export function useAxiosAuth() {
  const refreshToken = localStorage.getItem(AUTH_REFRESH_STORAGE)
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE)

  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use((config) => {
      console.log('request', token)
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
            if (!refreshToken) {
              await signOut()
            }
            const originalConfig = error.config
            if (originalConfig) {
              if (!isRefreshing) {
                isRefreshing = true
                try {
                  const tokenResponse = await axios.post('/refresh-token', {
                    refresh_token: refreshToken,
                  })

                  localStorage.setItem(
                    AUTH_TOKEN_STORAGE,
                    tokenResponse.data.token,
                  )
                  console.log('token', tokenResponse.data)

                  originalConfig.headers.common['Authorization'] =
                    tokenResponse.data.token

                  failedRequestQueue.forEach((request) => {
                    request.onSuccess(tokenResponse.data.token)
                  })

                  failedRequestQueue = []
                } catch (error) {
                  localStorage.clear()
                  await signOut({ redirect: false })
                  console.log('refresh')
                  failedRequestQueue.forEach((request) => {
                    request.onFailed(error)
                  })
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
  }, [refreshToken, token])

  return axiosAuth
}
