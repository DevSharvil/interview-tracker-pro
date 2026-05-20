import { Menu, Bell, Search } from 'lucide-react'

export default function Navbar({ onMenuClick, title = 'Overview' }) {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center gap-4 px-4 md:px-6 shrink-0">

      {/* hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg
          text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* page title */}
      <h1 className="text-base font-semibold text-gray-900 hidden sm:block">{title}</h1>

      {/* search */}
      <div className="flex-1 max-w-sm ml-auto sm:ml-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
              placeholder:text-gray-400 transition-all"
          />
        </div>
      </div>

      {/* notifications */}
      <button className="relative w-9 h-9 flex items-center justify-center rounded-lg
        text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors">
        <Bell className="w-4.5 h-4.5 w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white" />
      </button>
    </header>
  )
}