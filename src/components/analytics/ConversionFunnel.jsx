import { useMemo } from 'react'
import ChartCard from './ChartCard'

const STAGES = [
  { key: 'Applied',   label: 'Applied',   color: 'bg-blue-500',   text: 'text-blue-600',   bar: 'bg-blue-500'   },
  { key: 'Screening', label: 'Screening', color: 'bg-violet-500', text: 'text-violet-600', bar: 'bg-violet-500' },
  { key: 'Interview', label: 'Interview', color: 'bg-amber-500',  text: 'text-amber-600',  bar: 'bg-amber-500'  },
  { key: 'Offer',     label: 'Offer',     color: 'bg-emerald-500',text: 'text-emerald-600',bar: 'bg-emerald-500'},
]

export default function ConversionFunnel({ applications }) {
  const data = useMemo(() => {
    const total = applications.length || 1
    const counts = {}
    applications.forEach(a => {
      counts[a.status] = (counts[a.status] || 0) + 1
    })

    // cumulative — everyone who reached Interview also went through Applied
    const applied   = applications.length
    const screening = applications.filter(a =>
      ['Screening', 'Interview', 'Offer'].includes(a.status)
    ).length
    const interview = applications.filter(a =>
      ['Interview', 'Offer'].includes(a.status)
    ).length
    const offer     = applications.filter(a => a.status === 'Offer').length

    return [
      { ...STAGES[0], count: applied,   pct: 100 },
      { ...STAGES[1], count: screening, pct: applied   > 0 ? Math.round((screening / applied)   * 100) : 0 },
      { ...STAGES[2], count: interview, pct: screening > 0 ? Math.round((interview / screening) * 100) : 0 },
      { ...STAGES[3], count: offer,     pct: interview > 0 ? Math.round((offer     / interview) * 100) : 0 },
    ]
  }, [applications])

  return (
    <ChartCard
      title="Conversion Funnel"
      subtitle="Stage-by-stage drop-off rate"
    >
      {applications.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-sm text-gray-300">
          No data yet
        </div>
      ) : (
        <div className="space-y-3 mt-1">
          {data.map((stage, i) => (
            <div key={stage.key}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${stage.color}`} />
                  <span className="text-xs font-semibold text-gray-700">{stage.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold ${stage.text}`}>{stage.count}</span>
                  {i > 0 && (
                    <span className="text-xs text-gray-400 w-12 text-right">
                      {stage.pct}% conv.
                    </span>
                  )}
                  {i === 0 && (
                    <span className="text-xs text-gray-400 w-12 text-right">100%</span>
                  )}
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${stage.bar}`}
                  style={{ width: `${data[0].count > 0 ? (stage.count / data[0].count) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}

          {/* overall rate */}
          {data[3].count > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">Overall offer rate</span>
              <span className="text-sm font-black text-emerald-600">
                {data[0].count > 0
                  ? Math.round((data[3].count / data[0].count) * 100)
                  : 0}%
              </span>
            </div>
          )}
        </div>
      )}
    </ChartCard>
  )
}