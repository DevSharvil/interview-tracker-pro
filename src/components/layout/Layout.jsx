import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useSidebar } from '../../hooks/useSidebar'

const pageTitles = {
  '/dashboard':    'Overview',
  '/applications': 'Applications',
  '/interviews':   'Interviews',
  '/analytics':    'Analytics',
  '/settings':     'Settings',
}

export default function Layout({ children }) {
  const location = useLocation()
  const title = pageTitles[location.pathname] ?? 'Dashboard'
  const { open, collapsed, openSidebar, closeSidebar, toggleCollapse } = useSidebar()

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        open={open}
        collapsed={collapsed}
        onClose={closeSidebar}
        onToggleCollapse={toggleCollapse}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar onMenuClick={openSidebar} title={title} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}