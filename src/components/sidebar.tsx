'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CarSvg } from '../components/icons/car'
import { UserSvg } from '../components/icons/user'
import { EngineSvg } from '../components/icons/engine'
import { StatisticSvg } from '../components/icons/statistic'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="bg-main h-full fixed flex flex-col  z-10  px-4 gap-5 items-center justify-center py-[200px]">
      <Link href="/cars" className="flex flex-col items-center justify-center ">
        <CarSvg
          fill={pathname === '/cars' ? '#E11D48' : '#ffffff'}
          height={50}
          width={40}
        />
        <p className="text-gray-100 text-xs text-center">Carros</p>
      </Link>

      <Link
        href={'/users'}
        className="flex flex-col items-center justify-center"
      >
        <UserSvg
          fill={pathname === '/users' ? '#E11D48' : '#ffffff'}
          height={50}
          width={40}
        />
        <p className="text-gray-100 text-xs text-center">Usuários</p>
      </Link>

      <Link
        href={'/statistics'}
        className="flex flex-col items-center justify-center "
      >
        <StatisticSvg
          fill={pathname === '/statistics' ? '#E11D48' : '#ffffff'}
          height={50}
          width={40}
        />
        <p className="text-gray-100 text-xs text-center">Estatístitcas</p>
      </Link>

      <Link
        href={'/settings'}
        className="flex flex-col items-center justify-center "
      >
        <EngineSvg
          fill={pathname === '/settings' ? '#E11D48' : '#ffffff'}
          height={50}
          width={40}
        />
        <p className="text-gray-100 text-xs text-center">Configurações</p>
      </Link>
    </div>
  )
}
