'use client'

import { Inter } from 'next/font/google'
import { Eye, EyeSlash, Warning } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import loginImage from '@/assets/login_ilustration.png'
import Image from 'next/image'
import { Loading } from '@/components/loading'
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/button'

const LoginSchema = z.object({
  email: z.string().email('Obrigatório').min(1, 'Obrigatório'),
  password: z.string().min(6, 'Deve ter pelo menos 6 dígitos'),
})

type LoginSchemaFormData = z.infer<typeof LoginSchema>

const inter = Inter({ subsets: ['latin'] })

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigation = useRouter()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { password: '' },
  })

  async function onSubmit(data: LoginSchemaFormData) {
    try {
      setErrorMessage(undefined)
      setIsSubmitting(true)

      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (result?.error) {
        console.log(result.status)
        switch (result.error) {
          case 'CredentialsSignin':
            return toast.error('Email ou senha estão errados')
          default:
            return toast.error('Algo deu errado, tente mais')
        }
      }

      navigation.replace('/dashboard/cars')
    } catch (error) {
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    toast.error(errorMessage)
  }, [errorMessage])

  return (
    <div className="flex flex-1 h-screen">
      <div className={`flex-1 max-md:hidden`}>
        <Image
          src={loginImage}
          alt="image"
          style={{ objectFit: 'cover', height: '100%' }}
        />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col  items-center  overflow-auto  max-sm:px-[5rem] sm:w-full sm:px-[5rem] md:px-[10rem] md:w-[60%]"
      >
        <h1
          className={
            (inter.className, 'font-bold text-xl w-full text-center mt-[5rem]')
          }
        >
          Bem-vindos
        </h1>
        <p className="text-gray-400 text-center w-full mt-[3rem]">
          Faça login para gerenciar seus carros de maneira fácil
        </p>

        <div className="max-w-[23rem] w-full mb-10">
          <div className="flex flex-col mt-[5.625rem] w-full">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              className={`bg-gray-200 h-10 mt-5 rounded-lg p-4 outline-none ${errorMessage === 'CredencialSign' || errors.email ? 'border-[1px] border-red-600' : null}`}
              {...register('email')}
            />

            {errors.email && (
              <span className="flex flex-row gap-2 w-full items-center mt-2">
                <Warning size={20} color="#E11D48" weight="fill" />
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex flex-col mt-[2rem] w-full">
            <label htmlFor="password">Senha</label>

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <PasswordInput
                  errorMessage={errorMessage || errors.password?.message}
                  onChange={onChange}
                  value={value}
                />
              )}
            />

            {errors.password && (
              <span className="flex flex-row gap-2 w-full items-center mt-2">
                <Warning size={20} color="#E11D48" weight="fill" />
                {errors.password.message}
              </span>
            )}
          </div>
        </div>
        <Button isSubmitting={isSubmitting} text="Login" />
      </form>
    </div>
  )
}

interface LoginButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSubmitting: boolean
}

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage: string | undefined
}
function PasswordInput({ errorMessage, ...rest }: PasswordInputProps) {
  const [isHidenPassword, setIsHidenPassword] = useState(true)

  function handlehidePassword() {
    setIsHidenPassword(!isHidenPassword)
  }

  return (
    <div
      className={`flex flex-row justify-between px-4 items-center w-full rounded-lg bg-gray-200 h-10 mt-5 ${errorMessage === 'Invalid credentials.' || errorMessage ? 'border-[1px] border-red-600' : null}`}
    >
      <input
        type={isHidenPassword ? 'password' : 'text'}
        name="password"
        id="password"
        className="bg-gray-200 outline-none w-full mr-2"
        {...rest}
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
