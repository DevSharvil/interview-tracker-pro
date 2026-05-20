import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import { useMemo, useState } from 'react'
import ChartCard from './ChartCard'

const RANGES = [
  { label: '3M', months: 3  },
  { label: '6M', months: 6  },
  { label: '1Y', months: 12 },
]

function buildMonthlyData(applications, months) {
  const now    = new Date()
  const result = []

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    result.push({
      month: d.toLocaleDateString('en-US', { month: 'short', year: months > 6 ? '2-digit' : undefined }),
      key,
      Applied:   0,
      Interview: 0,
      Offer:     0,
    })
  }

  applications.forEach(app => {
    const d   = new Date(app.created_at || app.createdAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const slot = result.find(r => r.key === key)
    if (!slot) return
    slot.Applied++
    if (['Interview', 'Offer'].includes(app.status)) slot.Interview++
    if (app.status === 'Offer') slot.Offer++
  })

  return result
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3.5 py-3 min-w-[130px]">
      <p className="text-xs font-semibold text-gray-500 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-xs text-gray-600">{p.dataKey}</span>
          </div>
          <span className="text-xs font-bold text-gray-900">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function ApplicationsOverTime({ applications }) {
  const [range, setRange] = useState(RANGES[1])

  const data = useMemo(
    () => buildMonthlyData(applications, range.months),
    [applications, range]
  )

  const hasData = data.some(d => d.Applied > 0)

  const rangeToggle = (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
      {RANGES.map(r => (
        <button
          key={r.label}
          onClick={() => setRange(r)}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all
            ${range.label === r.label
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-400 hover:text-gray-600'
            }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  )

  return (
    <ChartCard
      title="Applications Over Time"
      subtitle="Monthly volume of applications, interviews, and offers"
      action={rangeToggle}
    >
      {!hasData ? (
        <div className="h-52 flex items-center justify-center text-sm text-gray-300">
          No data in this range
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gApplied" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}    />
              </linearGradient>
              <linearGradient id="gInterview" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}    />
              </linearGradient>
              <linearGradient id="gOffer" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone" dataKey="Applied"
              stroke="#3b82f6" strokeWidth={2}
              fill="url(#gApplied)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Area
              type="monotone" dataKey="Interview"
              stroke="#f59e0b" strokeWidth={2}
              fill="url(#gInterview)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Area
              type="monotone" dataKey="Offer"
              stroke="#10b981" strokeWidth={2}
              fill="url(#gOffer)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {/* inline legend */}
      <div className="flex gap-5 mt-2">
        {[
          { label: 'Applied',   color: '#3b82f6' },
          { label: 'Interview', color: '#f59e0b' },
          { label: 'Offer',     color: '#10b981' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 rounded-full" style={{ background: color }} />
            <span className="text-xs text-gray-400">{label}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  )
}