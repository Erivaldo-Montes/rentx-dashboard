'use client'
import { Header } from '@/components/header'
import { Plus, MagnifyingGlass, Table } from '@phosphor-icons/react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  AUTH_REFRESH_STORAGE,
  AUTH_TOKEN_STORAGE,
} from '@/storage/storage-config'
import { useEffect } from 'react'
import { List } from '@/components/list'
import { TableList } from '@/components/list copy'
export default function Cars() {
  const { data } = useSession()
  const refreshToken = localStorage.getItem(AUTH_REFRESH_STORAGE)
  useEffect(() => {
    if (!refreshToken && data) {
      localStorage.setItem(AUTH_TOKEN_STORAGE, data?.user.accessToken)
      localStorage.setItem(AUTH_REFRESH_STORAGE, data?.user.refreshToken)
    }
  }, [data, refreshToken])
  return (
    <div>
      <Header />
      <main className="md:pl-[10rem]  sm:px-[1rem] max-sm:px-[1rem]  lg:px-[10rem] xl:px-[20rem] mt-10 bg-gray-100 pb-10">
        <div className="flex justify-between max-md:flex-col gap-5">
          <Link href={'/dashboard/car/create'}>
            <button className="p-3 flex flex-row bg-blue-600 rounded-lg sm:w-[5rem]  gap-1 hover:bg-blue-500 transition-colors">
              <Plus color="#FFFFFF" width={20} height={20} />
              <p className="text-white text-sm">Criar</p>
            </button>
          </Link>
          <div className="bg-white rounded-full flex flex-row justify-center items-center px-4 h-10">
            <input
              placeholder="Perquisar"
              className="border-none outline-none ml-1 h-full w-full"
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
        {/* <List
          columns={['nome', 'Marca', 'Diária', 'Placa']}
          fieldsOrder={['name', 'brand', 'daily_rate', 'license_plate']}
          type="cars"
        /> */}
        <TableList
          columns={['nome', 'Marca', 'Diária', 'Placa']}
          fieldsOrder={['name', 'brand', 'daily_rate', 'license_plate']}
          type="cars"
        />
      </main>
    </div>
  )
}
