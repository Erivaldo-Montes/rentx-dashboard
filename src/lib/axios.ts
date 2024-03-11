import axios, { AxiosError, AxiosInstance } from 'axios'
import { cookies } from 'next/headers'
import { AUTH_REFRESH_COOKIE, AUTH_TOKEN_COOKIE } from '@/cookies/cookie-config'
import { signOut } from './auth'
import { redirect } from 'next/navigation'

type PromiseType = {
  onSuccess: (token: string) => void
  onFailure: () => void
}

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: () => () => void
}
const api = axios.create({
  baseURL: process.env.BASE_URL,
}) as APIInstanceProps

let failedQueue: Array<PromiseType> = []

let isRefreshing = false

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = cookies().get(AUTH_REFRESH_COOKIE)?.value

      if (error.response.data?.message === 'Unauthorized' && refreshToken) {
        const requestOriginalConfig = error.config

        if (!isRefreshing) {
          isRefreshing = true
          try {
            const response = await api.post('/refresh-token', {
              refresh_token: refreshToken,
            })

            failedQueue.forEach((request) => {
              request.onSuccess(response.data.token)
            })

            cookies().set(AUTH_TOKEN_COOKIE, response.data.token)
          } catch {
            cookies().delete(AUTH_TOKEN_COOKIE)
            cookies().delete(AUTH_REFRESH_COOKIE)

            await signOut()
            redirect('/login')
          } finally {
            failedQueue = []
            isRefreshing = false
          }
        }

        return new Promise((resolve, reject) => {
          failedQueue.push({
            onSuccess: (token: string) => {
              requestOriginalConfig.headers!.Authorization = `Bearer ${token}`

              resolve(api(requestOriginalConfig))
            },

            onFailure: () => {
              reject(error)
            },
          })
        })
      }

      await signOut()
      cookies().delete(AUTH_REFRESH_COOKIE)
      cookies().delete(AUTH_TOKEN_COOKIE)
      redirect('/login')
    }

    return Promise.reject(error.code)
  },
)

export { api }
