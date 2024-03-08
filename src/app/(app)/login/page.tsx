'use client'

import { authenticate } from '@/app/lib/action'
import { useFormState, useFormStatus } from 'react-dom'
import { Inter } from 'next/font/google'
import { Eye, EyeSlash } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import loginImage from '@/assets/login_ilustration.png'
import Image from 'next/image'
import { Loading } from '@/components/loading'
import { toast } from 'react-toastify'

const inter = Inter({ subsets: ['latin'] })

export default function LoginPage() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined)

  useEffect(() => {
    toast.error(errorMessage)
  }, [errorMessage])

  return (
    <div className="flex flex-1 h-screen">
      <div className={`flex-1`}>
        <Image
          src={loginImage}
          alt="iamge"
          style={{ objectFit: 'cover', height: '100%' }}
        />
      </div>
      <form
        action={dispatch}
        className="flex flex-col w-[60%] items-center  overflow-auto"
      >
        <h1
          className={
            (inter.className, 'font-bold text-xl w-full text-center mt-[5rem]')
          }
        >
          Bem-vindos
        </h1>
        <p className="text-gray-400 text-center mt-[3rem]">
          Faça login para gerenciar seus carros de maneira fácil
        </p>

        <div className="flex flex-col mt-[5.625rem] w-[23rem]">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="text"
            className="bg-gray-200 h-10 mt-5 rounded-lg p-4 outline-none"
          />
        </div>

        <div className="flex flex-col mt-[2rem] w-[23rem]">
          <label htmlFor="password">Senha</label>
          <PasswordInput />
        </div>

        <LoginButton />
      </form>
    </div>
  )
}

function LoginButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type={'submit'}
      className="mt-10 bg-green-600 p-2 flex items-center justify-center text-white rounded-lg w-[23rem]"
    >
      {pending ? <Loading color="white" /> : 'Log in'}
    </button>
  )
}

function PasswordInput() {
  const [isHidenPassword, setIsHidenPassword] = useState(true)

  function handlehidePassword() {
    setIsHidenPassword(!isHidenPassword)
  }

  return (
    <div className="flex flex-row justify-between px-4 items-center w-full rounded-lg bg-gray-200 h-10 mt-5">
      <input
        type={isHidenPassword ? 'password' : 'text'}
        name="password"
        id="password"
        className="bg-gray-200 outline-none w-full mr-2"
      />
      {isHidenPassword ? (
        <EyeSlash
          height={20}
          width={20}
          onClick={handlehidePassword}
          color="#777777"
        />
      ) : (
        <Eye
          height={20}
          width={20}
          onClick={handlehidePassword}
          color="#777777"
        />
      )}
    </div>
  )
}
