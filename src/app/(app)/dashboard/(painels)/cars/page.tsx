'use client'
import { Header } from '@/components/header'
import { Plus, MagnifyingGlass } from '@phosphor-icons/react'
import { CarList } from '@/components/carsList'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  AUTH_REFRESH_STORAGE,
  AUTH_TOKEN_STORAGE,
} from '@/storage/storage-config'
import { useEffect } from 'react'

export default function Cars() {
  const { data } = useSession()
  const refreshToken = localStorage.getItem(AUTH_REFRESH_STORAGE)
  useEffect(() => {
    console.log('asas', data?.user)
    if (!refreshToken && data) {
      localStorage.setItem(AUTH_TOKEN_STORAGE, data?.user.accessToken)
      localStorage.setItem(AUTH_REFRESH_STORAGE, data?.user.refreshToken)
    }
  }, [data, refreshToken])
  return (
    <div>
      <Header />
      <main className="sm:pl-[10rem] sm:pr-[5rem] max-sm:pr-[3rem] max-sm:pl-[6rem] lg:px-[10rem] xl:px-[20rem] mt-10 bg-gray-100 pb-10">
        <div className="flex justify-between">
          <Link href={'/dashboard/car/create'}>
            <button className="p-3 flex flex-row bg-blue-600 rounded-lg sm:w-[5rem]  gap-1 hover:bg-blue-500 transition-colors">
              <Plus color="#FFFFFF" width={20} height={20} />
              <p className="text-white text-sm">Criar</p>
            </button>
          </Link>
          <div className="bg-white rounded-full flex flex-row justify-center items-center px-4">
            <input
              placeholder="Perquisar"
              className="border-none outline-none ml-1"
            />
            <MagnifyingGlass
              color="#6b7280"
              width={20}
              height={20}
              className="hover:cursor-pointer"
            />
          </div>
        </div>
        <p className="text-sm mt-[2rem]">Lista de carros</p>
        <div className="bg-gray-300 flex rounded-t-lg w-full justify-between ">
          <div className="text-center p-2 w-40 ">Nome</div>
          <div className="text-center p-2  w-40">Marca</div>
          <div className="text-center p-2 w-40"> Diária</div>
          <div className="text-center p-2 w-40">Placa</div>
          <div className="text-center rounded-tr-lg p-2 w-40">Disponível</div>
        </div>
        <CarList />
      </main>
    </div>
  )
}
