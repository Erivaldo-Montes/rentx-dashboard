import { SidebarContext } from '@/contexts/sidebar'
import { useContext } from 'react'

export function useSidebar() {
  return useContext(SidebarContext)
}
