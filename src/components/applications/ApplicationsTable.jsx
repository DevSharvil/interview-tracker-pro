import { useState, useMemo, useCallback } from 'react'
import {
  ExternalLink, Pencil, Trash2, ChevronUp, ChevronDown,
  ChevronsUpDown, Building2, Plus, MoreHorizontal
} from 'lucide-react'
import StatusBadge from './StatusBadge'
import TableFilters from './TableFilters'
import TableSkeleton from './TableSkeleton'

// ─── sort helpers ──────────────────────────────────────────────────────────────

function SortIcon({ field, sort }) {
  if (sort.field !== field) return <ChevronsUpDown className="w-3 h-3 text-gray-300" />
  return sort.dir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-blue-500" />
    : <ChevronDown className="w-3 h-3 text-blue-500" />
}

function Th({ label, field, sort, onSort, className = '' }) {
  const active = sort.field === field
  return (
    <th
      onClick={() => onSort(field)}
      className={`px-5 py-3.5 text-left cursor-pointer select-none group ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <span className={`text-xs font-semibold uppercase tracking-wider transition-colors
          ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
          {label}
        </span>
        <SortIcon field={field} sort={sort} />
      </div>
    </th>
  )
}

// ─── mobile card ──────────────────────────────────────────────────────────────

function MobileCard({ app, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const initial = app.company?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="p-4 border-b border-gray-50 last:border-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50
            flex items-center justify-center shrink-0 border border-gray-100">
            <span className="text-sm font-bold text-gray-500">{initial}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{app.company}</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{app.role}</p>
            {app.location && (
              <p className="text-xs text-gray-400 mt-0.5">{app.location}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={app.status} />
          <div className="relative">
            <button
              onClick={() => setMenuOpen(m => !m)}
              className="w-7 h-7 flex items-center justify-center rounded-lg
                text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg
                  border border-gray-100 py-1.5 z-20 min-w-[130px]">
                  {app.link && (
                    <a href={app.link} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-gray-600
                        hover:bg-gray-50 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400" /> Open link
                    </a>
                  )}
                  <button
                    onClick={() => { onEdit(app); setMenuOpen(false) }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-gray-600
                      hover:bg-gray-50 transition-colors">
                    <Pencil className="w-3.5 h-3.5 text-gray-400" /> Edit
                  </button>
                  <button
                    // onClick={() => { onDelete(app.id); setMenuOpen(false) }}
                    onClick={() => { onDelete(app); setMenuOpen(false) }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-red-500
                      hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {app.salary && (
        <p className="text-xs text-gray-400 mt-2.5 pl-12">{app.salary}</p>
      )}

      <p className="text-xs text-gray-300 mt-1.5 pl-12">
        {new Date(app.created_at || app.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric',
        })}
      </p>
    </div>
  )
}

// ─── empty state ──────────────────────────────────────────────────────────────

function EmptyState({ filtered, onAdd }) {
  if (filtered) {
    return (
      <tr>
        <td colSpan={6}>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
              <Building2 className="w-5 h-5 text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-500">No results match your filters</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search or status filter</p>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr>
      <td colSpan={6}>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4
            border-2 border-dashed border-gray-200">
            <Plus className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-sm font-semibold text-gray-600">No applications yet</p>
          <p className="text-xs text-gray-400 mt-1 mb-5">Start tracking your job search</p>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
              text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Add your first application
          </button>
        </div>
      </td>
    </tr>
  )
}

// ─── main table ───────────────────────────────────────────────────────────────

const PAGE_SIZE_OPTIONS = [10, 25, 50]

export default function ApplicationsTable({
  applications = [],
  loading       = false,
  onAdd,
  onEdit,
  onDelete,
}) {
  const [search,  setSearch]  = useState('')
  const [status,  setStatus]  = useState('All')
  const [company, setCompany] = useState('')
  const [sort,    setSort]    = useState({ field: 'created_at', dir: 'desc' })
  const [page,    setPage]    = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const companies = useMemo(() =>
    [...new Set(applications.map(a => a.company))].sort()
  , [applications])

  const handleSort = useCallback((field) => {
    setSort(s => ({
      field,
      dir: s.field === field && s.dir === 'asc' ? 'desc' : 'asc',
    }))
    setPage(1)
  }, [])

  const clearFilters = () => {
    setSearch(''); setStatus('All'); setCompany('')
    setPage(1)
  }

  // filter
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return applications.filter(a => {
      const matchSearch = !q ||
        a.company.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q)   ||
        a.location?.toLowerCase().includes(q)
      const matchStatus  = status === 'All' || a.status === status
      const matchCompany = !company || a.company === company
      return matchSearch && matchStatus && matchCompany
    })
  }, [applications, search, status, company])

  // sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av = a[sort.field] ?? ''
      let bv = b[sort.field] ?? ''
      if (sort.field === 'created_at') {
        av = new Date(av).getTime()
        bv = new Date(bv).getTime()
      } else {
        av = av.toString().toLowerCase()
        bv = bv.toString().toLowerCase()
      }
      if (av < bv) return sort.dir === 'asc' ? -1 : 1
      if (av > bv) return sort.dir === 'asc' ? 1 : -1
      return 0
    })
  }, [filtered, sort])

  // paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const paginated  = sorted.slice((page - 1) * pageSize, page * pageSize)

  const hasFilters = search || status !== 'All' || company

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">

      {/* filters */}
      <TableFilters
        search={search}    onSearch={v => { setSearch(v);  setPage(1) }}
        status={status}    onStatus={v => { setStatus(v);  setPage(1) }}
        company={company}  onCompany={v => { setCompany(v); setPage(1) }}
        companies={companies}
        total={applications.length}
        filtered={filtered.length}
        onClear={clearFilters}
      />

      {/* ── desktop table ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <Th label="Company"  field="company"    sort={sort} onSort={handleSort} className="w-[22%]" />
              <Th label="Role"     field="role"       sort={sort} onSort={handleSort} className="w-[24%]" />
              <Th label="Location" field="location"   sort={sort} onSort={handleSort} className="w-[15%]" />
              <Th label="Status"   field="status"     sort={sort} onSort={handleSort} className="w-[14%]" />
              <Th label="Applied"  field="created_at" sort={sort} onSort={handleSort} className="w-[13%]" />
              <th className="px-5 py-3.5 text-right w-[12%]">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <TableSkeleton rows={pageSize} />
            ) : paginated.length === 0 ? (
              <EmptyState filtered={!!hasFilters} onAdd={onAdd} />
            ) : (
              paginated.map(app => {
                const initial = app.company?.[0]?.toUpperCase() ?? '?'
                const date    = new Date(app.created_at || app.createdAt)
                  .toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

                return (
                  <tr key={app.id}
                    className="hover:bg-blue-50/20 transition-colors group">

                    {/* company */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50
                          flex items-center justify-center shrink-0 border border-gray-100">
                          <span className="text-xs font-bold text-gray-500">{initial}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800 truncate max-w-[120px]">
                          {app.company}
                        </span>
                      </div>
                    </td>

                    {/* role */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-700 truncate max-w-[160px]">{app.role}</p>
                      {app.salary && (
                        <p className="text-xs text-gray-400 mt-0.5">{app.salary}</p>
                      )}
                    </td>

                    {/* location */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-500">{app.location || '—'}</span>
                    </td>

                    {/* status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={app.status} />
                    </td>

                    {/* date */}
                    <td className="px-5 py-4">
                      <span className="text-xs text-gray-400">{date}</span>
                    </td>

                    {/* actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 justify-end
                        opacity-0 group-hover:opacity-100 transition-opacity">
                        {app.link && (
                          <a href={app.link} target="_blank" rel="noreferrer"
                            className="w-7 h-7 flex items-center justify-center rounded-lg
                              text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                            title="Open job link">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => onEdit(app)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg
                            text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                        //   onClick={() => onDelete(app.id)}
                        onClick={() => onDelete(app)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg
                            text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── mobile cards ── */}
      <div className="md:hidden">
        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <Building2 className="w-8 h-8 text-gray-300 mb-3" />
            <p className="text-sm font-semibold text-gray-500">
              {hasFilters ? 'No results' : 'No applications yet'}
            </p>
            {!hasFilters && (
              <button onClick={onAdd}
                className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                  text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
                <Plus className="w-4 h-4" /> Add Application
              </button>
            )}
          </div>
        ) : (
          paginated.map(app => (
            <MobileCard
              key={app.id}
              app={app}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      {/* ── pagination ── */}
      {!loading && sorted.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between
          gap-3 px-5 py-3.5 border-t border-gray-100 bg-gray-50/40">

          {/* page size */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Rows per page</span>
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
              className="border border-gray-200 rounded-lg px-2 py-1 text-xs
                bg-white focus:outline-none focus:border-blue-400 cursor-pointer"
            >
              {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span className="text-gray-400">
              {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
            </span>
          </div>

          {/* page buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-xs
                text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed
                transition-colors font-medium"
            >
              «
            </button>
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-xs
                text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed
                transition-colors"
            >
              ‹
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let p
              if (totalPages <= 5)            p = i + 1
              else if (page <= 3)             p = i + 1
              else if (page >= totalPages - 2) p = totalPages - 4 + i
              else                            p = page - 2 + i
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs
                    font-medium transition-colors
                    ${page === p
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                  {p}
                </button>
              )
            })}

            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-xs
                text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed
                transition-colors"
            >
              ›
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-xs
                text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed
                transition-colors font-medium"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  )
}