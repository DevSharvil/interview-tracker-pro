import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Cell,
  Tooltip, ResponsiveContainer
} from 'recharts'
import ChartCard from './ChartCard'

const STATUS_COLOR = {
  Applied:   '#3b82f6',
  Screening: '#8b5cf6',
  Interview: '#f59e0b',
  Offer:     '#10b981',
  Rejected:  '#ef4444',
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3.5 py-2.5">
      <p className="text-xs font-bold text-gray-800 mb-1.5">{d.company}</p>
      <p className="text-xs text-gray-500">{d.count} application{d.count !== 1 ? 's' : ''}</p>
      {d.latestStatus && (
        <div className="flex items-center gap-1.5 mt-1">
          <span className="w-2 h-2 rounded-full"
            style={{ background: STATUS_COLOR[d.latestStatus] }} />
          <span className="text-xs text-gray-400">{d.latestStatus}</span>
        </div>
      )}
    </div>
  )
}

export default function TopCompanies({ applications }) {
  const data = useMemo(() => {
    const map = {}
    applications.forEach(a => {
      if (!map[a.company]) map[a.company] = { count: 0, latestStatus: a.status }
      map[a.company].count++
      map[a.company].latestStatus = a.status
    })
    return Object.entries(map)
      .map(([company, v]) => ({ company, ...v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  }, [applications])

  if (data.length === 0) {
    return (
      <ChartCard title="Top Companies" subtitle="Most applied-to companies">
        <div className="h-48 flex items-center justify-center text-sm text-gray-300">
          No data yet
        </div>
      </ChartCard>
    )
  }

  return (
    <ChartCard
      title="Top Companies"
      subtitle={`Top ${data.length} most applied-to`}
    >
      <ResponsiveContainer width="100%" height={Math.max(180, data.length * 36)}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
          barSize={14}
        >
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="company"
            width={90}
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false} tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={entry.company}
                fill={STATUS_COLOR[entry.latestStatus] ?? '#94a3b8'}
                fillOpacity={1 - i * 0.08}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}