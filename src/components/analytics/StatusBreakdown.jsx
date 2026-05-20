import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'
import ChartCard from './ChartCard'

const PALETTE = {
  Applied:   { fill: '#3b82f6', light: '#eff6ff' },
  Screening: { fill: '#8b5cf6', light: '#f5f3ff' },
  Interview: { fill: '#f59e0b', light: '#fffbeb' },
  Offer:     { fill: '#10b981', light: '#ecfdf5' },
  Rejected:  { fill: '#ef4444', light: '#fef2f2' },
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0].payload
  const pct = payload[0].payload.pct
  const c = PALETTE[name]
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3.5 py-2.5">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: c?.fill }} />
        <span className="text-xs font-semibold text-gray-700">{name}</span>
      </div>
      <p className="text-lg font-black text-gray-900 mt-1 leading-none">{value}</p>
      <p className="text-xs text-gray-400">{pct}% of total</p>
    </div>
  )
}

export default function StatusBreakdown({ applications }) {
  const total = applications.length

  const data = Object.entries(
    applications.reduce((acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1
      return acc
    }, {})
  )
    .map(([name, value]) => ({
      name, value,
      pct: total > 0 ? Math.round((value / total) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value)

  if (data.length === 0) {
    return (
      <ChartCard title="Status Breakdown" subtitle="Distribution across all statuses">
        <div className="h-48 flex items-center justify-center text-sm text-gray-300">
          No data yet
        </div>
      </ChartCard>
    )
  }

  return (
    <ChartCard title="Status Breakdown" subtitle="Distribution across all statuses">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={60} outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map(entry => (
              <Cell
                key={entry.name}
                fill={PALETTE[entry.name]?.fill ?? '#94a3b8'}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* legend */}
      <div className="space-y-2 mt-1">
        {data.map(({ name, value, pct }) => {
          const c = PALETTE[name]
          return (
            <div key={name} className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c?.fill }} />
              <span className="text-xs text-gray-600 flex-1">{name}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: c?.fill }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-700 w-4 text-right">{value}</span>
              </div>
            </div>
          )
        })}
      </div>
    </ChartCard>
  )
}