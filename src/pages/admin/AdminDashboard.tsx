import { useEffect, useState } from 'react'
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { getAnalytics } from '../../lib/analytics'
import { StatCard } from '../../components/ui/Card'
import { useTheme } from '../../contexts/ThemeContext'
import type { AnalyticsData } from '../../types'

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6']

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{value: number}>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl px-4 py-3 border border-gray-200 dark:border-white/20 shadow-xl text-sm">
        <p className="text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        <p className="font-semibold text-gray-900 dark:text-white">{payload[0].value}</p>
      </div>
    )
  }
  return null
}

export function AdminDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const { isDark } = useTheme()

  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'
  const axisStroke = isDark ? '#4b5563' : '#d1d5db'
  const tickColor = isDark ? '#9ca3af' : '#6b7280'

  useEffect(() => {
    getAnalytics().then((d) => {
      setData(d)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 glass rounded-xl animate-pulse" />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-64 glass rounded-xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Platform overview and key metrics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Students" value={data?.totalStudents ?? 0} icon={<Users size={20} />} color="indigo" />
        <StatCard title="Total Courses" value={data?.totalCourses ?? 0} icon={<BookOpen size={20} />} color="gold" />
        <StatCard title="Certificates Issued" value={data?.totalCertificates ?? 0} icon={<Award size={20} />} color="green" />
        <StatCard title="Active Platform" value="Live" icon={<TrendingUp size={20} />} color="indigo" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Enrollments Chart */}
        <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-5">New Students (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data?.enrollmentsByMonth}>
              <defs>
                <linearGradient id="indigo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" stroke={axisStroke} tick={{ fill: tickColor, fontSize: 12 }} />
              <YAxis stroke={axisStroke} tick={{ fill: tickColor, fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fill="url(#indigo)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Courses */}
        <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-5">Top Courses by Enrollment</h3>
          {data?.topCourses && data.topCourses.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.topCourses} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                <XAxis type="number" stroke={axisStroke} tick={{ fill: tickColor, fontSize: 12 }} />
                <YAxis type="category" dataKey="title" width={100} tick={{ fill: tickColor, fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="enrolled" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-600 text-sm">No course data yet</div>
          )}
        </div>

        {/* Completion Rates */}
        <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-5">Completion by Category</h3>
          {data?.completionRates && data.completionRates.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.completionRates}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="category" stroke={axisStroke} tick={{ fill: tickColor, fontSize: 11 }} />
                <YAxis stroke={axisStroke} tick={{ fill: tickColor, fontSize: 12 }} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="rate" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-600 text-sm">No category data yet</div>
          )}
        </div>

        {/* Completion Pie */}
        <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-5">Course Completion Rates</h3>
          {data?.topCourses && data.topCourses.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data.topCourses.slice(0, 5)}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="completion"
                  nameKey="title"
                >
                  {data.topCourses.slice(0, 5).map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px', color: tickColor }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-600 text-sm">No data yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
