import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, CalendarDays,
  BarChart3, Settings, X, ChevronLeft,
  ChevronRight, LogOut
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const nav = [
  { label: 'Overview',     to: '/dashboard',   icon: LayoutDashboard },
  { label: 'Applications', to: '/applications', icon: Briefcase       },
  { label: 'Interviews',   to: '/interviews',   icon: CalendarDays    },
  { label: 'Analytics',    to: '/analytics',    icon: BarChart3       },
  { label: 'Settings',     to: '/settings',     icon: Settings        },
]

export default function Sidebar({ open, collapsed, onClose, onToggleCollapse }) {
  const { user, logout } = useAuth()

  const initials = user?.user_metadata?.name
    ? user.user_metadata.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0].toUpperCase() ?? 'U'

  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'

  return (
    <>
      {/* mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-40 flex flex-col bg-white border-r border-gray-100
        transition-all duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        ${collapsed ? 'w-[68px]' : 'w-60'}
      `}>

        {/* header */}
        <div className={`flex items-center h-16 px-4 border-b border-gray-100 shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                <Briefcase className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-gray-900 text-sm tracking-tight">
                ITracker
              </span>
            </div>
          )}

          {/* collapse toggle — desktop only */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-6 h-6 items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {collapsed
              ? <ChevronRight className="w-3.5 h-3.5" />
              : <ChevronLeft  className="w-3.5 h-3.5" />
            }
          </button>

          {/* close — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
          {nav.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              onClick={() => { if (window.innerWidth < 1024) onClose() }}
              className={({ isActive }) => `
                group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                transition-colors duration-150 relative
                ${collapsed ? 'justify-center' : ''}
                ${isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  {!collapsed && <span>{label}</span>}

                  {/* tooltip on collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-md
                      opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      {label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* user footer */}
        <div className={`shrink-0 border-t border-gray-100 p-3 ${collapsed ? 'flex justify-center' : ''}`}>
          {collapsed ? (
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-semibold text-blue-600">{initials}</span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-blue-600">{initials}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate leading-tight">{displayName}</p>
                  <p className="text-xs text-gray-400 truncate leading-tight">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="ml-2 w-7 h-7 flex items-center justify-center rounded-md text-gray-400
                  hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}