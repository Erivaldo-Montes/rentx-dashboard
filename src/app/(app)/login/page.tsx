'use client'

import { authenticate } from '@/app/lib/action'
import { useFormState, useFormStatus } from 'react-dom'
export default function LoginPage() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined)

  return <form action={dispatch} className="space-y-3"></form>
}

function LoginButton() {
  const { pending } = useFormStatus()

  return (
    <button className="mt-4 w-full" aria-disabled={pending}>
      Log in
    </button>
  )
}
