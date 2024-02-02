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
    <div className="bg-main h-full fixed px-10">
      <Link href="/cars">
        <CarSvg
          fill={pathname === '/cars' ? '#E11D48' : '#ffffff'}
          height={50}
          width={40}
        />
      </Link>

      <Link href={'/users'}>
        <UserSvg
          fill={pathname === '/users' ? '#E11D48' : '#ffffff'}
          height={50}
          width={40}
        />
      </Link>

      <Link href={'/settings'}>
        <EngineSvg
          fill={pathname === '/settings' ? '#E11D48' : '#ffffff'}
          height={50}
          width={40}
        />
      </Link>

      <Link href={'/statistics'}>
        <StatisticSvg
          fill={pathname === '/statistics' ? '#E11D48' : '#ffffff'}
          height={50}
          width={40}
        />
      </Link>
    </div>
  )
}
