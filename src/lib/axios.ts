'use client'
import axios from 'axios'
import { signOut } from 'next-auth/react'
import { AppError } from '@/utils/appError'

import {
  AUTH_REFRESH_STORAGE,
  AUTH_TOKEN_STORAGE,
} from '@/storage/storage-config'

const baseURL = 'http://0.0.0.0:3333'

type FailedQueue = {
  onSuccess: (token: string) => void
  onFailed: (error: any) => void
}

let failedRequestQueue: FailedQueue[] = []

let isRefreshing = false

const api = axios.create({
  baseURL,
  headers: {
    'Access-Control-Allow-Methods': `GET PUT POST DELETE OPTIONS`,
    'Access-Control-Allow-Origin': `*`,
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (error.response?.data?.message === 'Unauthorized') {
        // atualizar token
        const originalConfig = error.config
        const refreshToken = localStorage.getItem(AUTH_REFRESH_STORAGE)

        if (!isRefreshing) {
          isRefreshing = true
          api
            .post('/refresh-token', {
              refresh_token: refreshToken,
            })
            .then((response) => {
              localStorage.setItem(AUTH_TOKEN_STORAGE, response.data.token)

              originalConfig.headers.Authorization = response.data.token
              console.log('refresh')
              api.defaults.headers['Authorization'] =
                `Bearer ${response.data.token}`

              failedRequestQueue.forEach((request) => {
                request.onSuccess(response.data.token)
              })

              failedRequestQueue = []
            })
            .catch((error) => {
              localStorage.clear()
              signOut().then()
              failedRequestQueue.forEach((request) => {
                request.onFailed(error)
              })
              failedRequestQueue = []

              console.log(error)
            })
            .finally(() => {
              isRefreshing = false
            })
        }

        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers.Authorization = `Bearer ${token}`
              console.log('resolve')
              resolve(api(originalConfig))
            },
            onFailed: (error) => {
              reject(error)
            },
          })
        })
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

export { api, baseURL }
