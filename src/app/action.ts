'use server'

import { signOut } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function signOutSession() {
  cookies().delete('authjs.session-token')
  cookies().delete('authjs.csrf-token')
  cookies().delete('authjs.callback-url')

  await signOut()
}
