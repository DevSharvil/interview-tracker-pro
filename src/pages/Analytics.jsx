import Layout from '../components/layout/Layout'
import { useApplications } from '../context/ApplicationContext'
import StatCards from '../components/analytics/StatCards'
import StatusBreakdown from '../components/analytics/StatusBreakdown'
import ApplicationsOverTime from '../components/analytics/ApplicationsOverTime'
import TopCompanies from '../components/analytics/TopCompanies'
import ConversionFunnel from '../components/analytics/ConversionFunnel'

export default function Analytics() {
  const { applications, loading } = useApplications()

  if (loading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 h-72 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-72 bg-gray-100 rounded-xl animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-5">

        {/* heading */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Insights across {applications.length} application{applications.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* KPI cards */}
        <StatCards applications={applications} />

        {/* area chart + donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ApplicationsOverTime applications={applications} />
          </div>
          <StatusBreakdown applications={applications} />
        </div>

        {/* top companies + funnel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TopCompanies applications={applications} />
          <ConversionFunnel applications={applications} />
        </div>

      </div>
    </Layout>
  )
}