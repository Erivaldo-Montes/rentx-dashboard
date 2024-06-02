'use client'

import React, { createContext, useState } from 'react'
interface ISidebarContext {
  showSidebar: (isHidden: boolean) => void
  isShowSidebar: boolean
  setSidebarWidth: (number: number) => void
  sidebarWidth: number
}

const SidebarContext = createContext({} as ISidebarContext)

type ISidebarProvider = {
  children: React.ReactNode
}

function SidebarProvider({ children }: ISidebarProvider) {
  const [isShowSidebar, setIShowSidebar] = useState<boolean>(false)
  const [sidebarWidth, setSidebarWidth] = useState<number>(0)
  function showSidebar(isHidden: boolean) {
    setIShowSidebar(isHidden)
  }

  return (
    <SidebarContext.Provider
      value={{ isShowSidebar, showSidebar, sidebarWidth, setSidebarWidth }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export { SidebarContext, SidebarProvider }
