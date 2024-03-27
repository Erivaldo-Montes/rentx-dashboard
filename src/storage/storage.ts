'use Client'

import { AUTH_REFRESH_STORAGE, AUTH_TOKEN_STORAGE } from './storage-config'

interface Props {
  acessToken: string
  refreshToken: string
}

export function setItems({ acessToken, refreshToken }: Props) {
  localStorage.setItem(AUTH_REFRESH_STORAGE, refreshToken)
  localStorage.setItem(AUTH_TOKEN_STORAGE, acessToken)
}
