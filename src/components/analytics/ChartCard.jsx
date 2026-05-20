export default function ChartCard({ title, subtitle, children, action, className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 overflow-hidden ${className}`}>
      <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-gray-800 leading-tight">{title}</h3>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="px-5 pb-5">
        {children}
      </div>
    </div>
  )
}