'use client'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useSidebar } from '@/hooks/useSidebar'
import { useEffect, useRef } from 'react'

export function Header() {
  const { data: session } = useSession()
  const checkboxRef = useRef<HTMLInputElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const { showSidebar, isShowSidebar } = useSidebar()
  function handleToggleMenu() {
    if (checkboxRef.current) {
      const isChecked = checkboxRef.current.checked
      checkboxRef.current.checked = !isChecked
      showSidebar(isChecked)
      if (iconRef.current) {
        iconRef.current.className = !isShowSidebar ? 'icon-close' : 'icon-menu'
      }
    }
  }

  return (
    <div className="bg-gray-100 flex flex-row items-center lg:px-[10rem] xl:px-[20rem] sm:px-[1rem] max-sm:px-[1rem] md:px-[10rem] w-full py-6 drop-shadow-lg">
      {window.screen.width < 768 && (
        <div
          id="container"
          onClick={handleToggleMenu}
          ref={menuRef}
          className="mr-2"
        >
          <input type="checkbox" id="checkbox" ref={checkboxRef} />
          <h1 id="icon-container">
            <div id="icon" className="icon-menu" ref={iconRef} />
          </h1>
        </div>
      )}

      <div className="flex flex-row ">
        <Image
          src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="user image"
          width={40}
          height={40}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="ml-5">
          <p className="text-main">{session?.user?.name}</p>
          <p className="text-subtitle">Admin</p>
        </div>
      </div>
    </div>
  )
}
