import { useState, useEffect } from 'react'

export function useSidebar() {
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  // close mobile sidebar on resize to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setOpen(false)
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return {
    open,
    collapsed,
    openSidebar: () => setOpen(true),
    closeSidebar: () => setOpen(false),
    toggleCollapse: () => setCollapsed(c => !c),
  }
}