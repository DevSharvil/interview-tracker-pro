import Layout from '../components/layout/Layout'
import {
  Briefcase, CalendarDays, Trophy, XCircle,
  TrendingUp, ArrowUpRight, Clock, Building2
} from 'lucide-react'
import { useApplications } from '../context/ApplicationContext'
import { useMemo } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, PieChart, Pie, Cell
} from 'recharts'

const STATUS_COLORS = {
  Applied:   '#3b82f6',
  Screening: '#8b5cf6',
  Interview: '#f59e0b',
  Offer:     '#10b981',
  Rejected:  '#ef4444',
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  const colors = {
    blue:   'bg-blue-50 text-blue-600',
    amber:  'bg-amber-50 text-amber-600',
    green:  'bg-green-50 text-green-600',
    red:    'bg-red-50 text-red-600',
  }
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  )
}

function RecentRow({ app }) {
  const badge = {
    Applied:   'bg-blue-50 text-blue-600',
    Screening: 'bg-purple-50 text-purple-600',
    Interview: 'bg-amber-50 text-amber-600',
    Offer:     'bg-green-50 text-green-600',
    Rejected:  'bg-red-50 text-red-600',
  }
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
        <Building2 className="w-4 h-4 text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{app.company}</p>
        <p className="text-xs text-gray-400 truncate">{app.role}</p>
      </div>
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${badge[app.status]}`}>
        {app.status}
      </span>
    </div>
  )
}

export default function Dashboard() {
  const { applications } = useApplications()

  const stats = useMemo(() => ({
    total:     applications.length,
    interview: applications.filter(a => a.status === 'Interview').length,
    offer:     applications.filter(a => a.status === 'Offer').length,
    rejected:  applications.filter(a => a.status === 'Rejected').length,
  }), [applications])

  const chartData = useMemo(() => {
    const counts = {}
    applications.forEach(a => {
      counts[a.status] = (counts[a.status] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [applications])

  const recent = applications.slice(0, 5)

  return (
    <Layout>
      <div className="space-y-5 max-w-5xl mx-auto">

        {/* greeting */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">Good morning 👋</h2>
          <p className="text-sm text-gray-400 mt-0.5">Here's what's happening with your job search.</p>
        </div>

        {/* stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Briefcase}    label="Total Applied" value={stats.total}     color="blue"  sub="all time" />
          <StatCard icon={CalendarDays} label="Interviews"    value={stats.interview} color="amber" sub="scheduled" />
          <StatCard icon={Trophy}       label="Offers"        value={stats.offer}     color="green" sub="received" />
          <StatCard icon={XCircle}      label="Rejected"      value={stats.rejected}  color="red"   sub="closed" />
        </div>

        {/* charts + recent */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* bar chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Applications by Status</h3>
                <p className="text-xs text-gray-400 mt-0.5">{applications.length} total</p>
              </div>
              <TrendingUp className="w-4 h-4 text-gray-300" />
            </div>

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} barSize={28}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={24} />
                  <Tooltip
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #f3f4f6', boxShadow: 'none' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map(entry => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? '#94a3b8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-300 text-sm">
                No data yet
              </div>
            )}
          </div>

          {/* pie chart */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Breakdown</h3>
            <p className="text-xs text-gray-400 mb-4">Status distribution</p>

            {chartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={65}
                      dataKey="value" paddingAngle={3}>
                      {chartData.map(entry => (
                        <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #f3f4f6', boxShadow: 'none' }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="mt-3 space-y-1.5">
                  {chartData.map(({ name, value }) => (
                    <div key={name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: STATUS_COLORS[name] }} />
                        <span className="text-xs text-gray-500">{name}</span>
                      </div>
                      <span className="text-xs font-medium text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[140px] flex items-center justify-center text-gray-300 text-sm">
                No data yet
              </div>
            )}
          </div>
        </div>

        {/* recent applications */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Recent Applications</h3>
              <p className="text-xs text-gray-400 mt-0.5">Last {recent.length} added</p>
            </div>
            <Clock className="w-4 h-4 text-gray-300" />
          </div>

          {recent.length > 0 ? (
            <div>
              {recent.map(app => <RecentRow key={app.id} app={app} />)}
            </div>
          ) : (
            <div className="py-10 text-center text-gray-300 text-sm">
              No applications yet — add your first one!
            </div>
          )}
        </div>

      </div>
    </Layout>
  )
}