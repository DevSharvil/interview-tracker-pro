import {
  Briefcase, CalendarCheck, Trophy,
  XCircle, TrendingUp, TrendingDown, Minus
} from 'lucide-react'

function Trend({ value }) {
  if (value === 0) return (
    <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
      <Minus className="w-3 h-3" /> No change
    </span>
  )
  const up = value > 0
  return (
    <span className={`flex items-center gap-1 text-xs font-semibold
      ${up ? 'text-emerald-600' : 'text-red-500'}`}>
      {up
        ? <TrendingUp  className="w-3 h-3" />
        : <TrendingDown className="w-3 h-3" />
      }
      {Math.abs(value)}% this month
    </span>
  )
}

function Card({ icon: Icon, label, value, trend, color, bg, note }) {
  return (
    <div className={`rounded-xl border border-gray-100 bg-white p-5
      hover:shadow-md hover:shadow-gray-100 transition-shadow duration-200`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <Trend value={trend} />
      </div>
      <p className="text-3xl font-black text-gray-900 leading-none tracking-tight">
        {value}
      </p>
      <p className="text-sm font-medium text-gray-500 mt-1.5">{label}</p>
      {note && <p className="text-xs text-gray-400 mt-1">{note}</p>}
    </div>
  )
}

export default function StatCards({ applications }) {
  const total     = applications.length
  const interview = applications.filter(a => a.status === 'Interview').length
  const offer     = applications.filter(a => a.status === 'Offer').length
  const rejected  = applications.filter(a => a.status === 'Rejected').length
  const screening = applications.filter(a => a.status === 'Screening').length

  const responseRate = total > 0
    ? Math.round(((interview + offer + rejected + screening) / total) * 100)
    : 0

  const offerRate = total > 0
    ? Math.round((offer / total) * 100)
    : 0

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <Card
        icon={Briefcase}
        label="Total Applied"
        value={total}
        trend={0}
        color="text-blue-600"
        bg="bg-blue-50"
        note="all time"
      />
      <Card
        icon={CalendarCheck}
        label="Interviews"
        value={interview}
        trend={interview > 0 ? 12 : 0}
        color="text-amber-600"
        bg="bg-amber-50"
        note={`${responseRate}% response rate`}
      />
      <Card
        icon={Trophy}
        label="Offers"
        value={offer}
        trend={offer > 0 ? 8 : 0}
        color="text-emerald-600"
        bg="bg-emerald-50"
        note={`${offerRate}% offer rate`}
      />
      <Card
        icon={XCircle}
        label="Rejected"
        value={rejected}
        trend={rejected > 0 ? -5 : 0}
        color="text-red-500"
        bg="bg-red-50"
        note="closed applications"
      />
    </div>
  )
}