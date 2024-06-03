'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CarSvg } from '../components/icons/car'
import { UserSvg } from '../components/icons/user'
import { EngineSvg } from '../components/icons/engine'
import { StatisticSvg } from '../components/icons/statistic'
import { useSidebar } from '@/hooks/useSidebar'
import { useEffect, useRef, useState } from 'react'

export function Sidebar() {
  const pathname = usePathname()

  const { isShowSidebar, showSidebar } = useSidebar()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const sidebarWidth = sidebarRef.current ? sidebarRef.current?.offsetWidth : 0

  useEffect(() => {
    if (window.screen.width < 768) {
      if (isShowSidebar) {
        blockScroll()
      } else {
        unblockScroll()
      }
    }
    function preventDefault(e) {
      e.preventDefault()
    }

    function blockScroll() {
      window.addEventListener('scroll', preventDefault, { passive: false })
      window.addEventListener('wheel', preventDefault, { passive: false })
      window.addEventListener('touchmove', preventDefault, { passive: false })
    }

    function unblockScroll() {
      window.removeEventListener('scroll', preventDefault)
      window.removeEventListener('wheel', preventDefault)
      window.removeEventListener('touchmove', preventDefault)
    }

    return () => {
      window.removeEventListener('scroll', preventDefault)
      window.removeEventListener('wheel', preventDefault)
      window.removeEventListener('touchmove', preventDefault)
    }
  }, [isShowSidebar])

  useEffect(() => {
    function handleResize() {
      if (window.screen.width < 768) {
        showSidebar(false)
      } else {
        showSidebar(true)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div
      className={`bg-main h-full max-md:h-screen fixed   flex flex-col z-10 max-md:z-0 px-4 gap-5 items-center md:justify-center max-md:justify-normal max-sm:py-[10rem] py-[200px] transition-transform`}
      ref={sidebarRef}
      style={{
        transform: !isShowSidebar
          ? `translate(-${sidebarWidth}px, 0px)`
          : `translate(0px, 0px)`,
      }}
    >
      <Link
        href="/dashboard/cars"
        className="flex sm:flex-row md:flex-col items-center gap-3 justify-center "
      >
        <CarSvg
          fill={pathname === '/dashboard/cars' ? '#E11D48' : '#ffffff'}
          height={50}
          width={40}
        />
        <p className="text-gray-100 text-xs text-center">Carros</p>
      </Link>

      <Link
        href={'/dashboard/users'}
        className="flex sm:flex-row md:flex-col items-center justify-center gap-3 "
      >
        <UserSvg
          fill={pathname === '/dashboard/users' ? '#E11D48' : '#ffffff'}
          height={50}
          width={40}
        />
        <p className="text-gray-100 text-xs text-center">Usuários</p>
      </Link>

      <Link
        href={'/dashboard/statistics'}
        className="flex sm:flex-row md:flex-col items-center justify-center gap-3 "
      >
        <StatisticSvg
          fill={pathname === '/dashboard/statistics' ? '#E11D48' : '#ffffff'}
          height={50}
          width={40}
        />
        <p className="text-gray-100 text-xs text-center">Estatístitcas</p>
      </Link>

      <Link
        href={'/dashboard/settings'}
        className="flex sm:flex-row md:flex-col items-center justify-center gap-3 "
      >
        <EngineSvg
          fill={pathname === '/dashboard/settings' ? '#E11D48' : '#ffffff'}
          height={50}
          width={40}
        />
        <p className="text-gray-100 text-xs text-center">Configurações</p>
      </Link>
    </div>
  )
}
