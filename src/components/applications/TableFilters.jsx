
import { Search, SlidersHorizontal, X } from 'lucide-react'

const STATUSES = ['All', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected']

export default function TableFilters({
  search, onSearch,
  status, onStatus,
  company, onCompany,
  companies,
  total, filtered,
  onClear,
}) {
  const hasFilters = search || status !== 'All' || company

  return (
    <div className="p-4 border-b border-gray-100 space-y-3">
      {/* top row */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search company, role…"
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg
              focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50
              placeholder:text-gray-400 transition-all"
          />
        </div>

        {/* company filter */}
        <select
          value={company}
          onChange={e => onCompany(e.target.value)}
          className="pl-3 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg
            focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50
            text-gray-600 transition-all min-w-[150px] appearance-none cursor-pointer"
        >
          <option value="">All Companies</option>
          {companies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* clear */}
        {hasFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500
              hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* status tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => onStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
              ${status === s
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
          >
            {s}
          </button>
        ))}

        {/* result count */}
        {hasFilters && (
          <span className="ml-auto text-xs text-gray-400 self-center">
            {filtered} of {total} shown
          </span>
        )}
      </div>
    </div>
  )
}