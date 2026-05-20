const config = {
  Applied:   { dot: 'bg-blue-400',   text: 'text-blue-700',   bg: 'bg-blue-50/80',   ring: 'ring-blue-100'   },
  Screening: { dot: 'bg-violet-400', text: 'text-violet-700', bg: 'bg-violet-50/80', ring: 'ring-violet-100' },
  Interview: { dot: 'bg-amber-400',  text: 'text-amber-700',  bg: 'bg-amber-50/80',  ring: 'ring-amber-100'  },
  Offer:     { dot: 'bg-emerald-400',text: 'text-emerald-700',bg: 'bg-emerald-50/80',ring: 'ring-emerald-100'},
  Rejected:  { dot: 'bg-red-400',    text: 'text-red-600',    bg: 'bg-red-50/80',    ring: 'ring-red-100'    },
}

export default function StatusBadge({ status }) {
  const c = config[status] ?? config.Applied
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
      ring-1 ${c.bg} ${c.text} ${c.ring}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  )
}