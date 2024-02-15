import { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage: any
}

export function Input({ errorMessage, ...rest }: Props) {
  return (
    <input
      className={`rounded-lg p-2 outline-gray-300 ${errorMessage && 'border-red-600 border-2 outline-red-600'}`}
      {...rest}
    />
  )
}
