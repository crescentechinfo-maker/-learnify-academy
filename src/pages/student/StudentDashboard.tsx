import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Award, TrendingUp, Play, ChevronRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getAllProgress } from '../../lib/progress'
import { getCourses } from '../../lib/courses'
import { getUserCertificates } from '../../lib/certificates'
import { StatCard } from '../../components/ui/Card'
import { CourseCard } from '../../components/CourseCard'
import { ProgressBar } from '../../components/ui/ProgressBar'
import type { Course, Progress, Certificate } from '../../types'

export function StudentDashboard() {
  const { profile } = useAuth()
  const [progress, setProgress] = useState<Progress[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [certs, setCerts] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    Promise.all([getAllProgress(profile.id), getCourses(), getUserCertificates(profile.id)])
      .then(([p, c, cert]) => { setProgress(p); setCourses(c); setCerts(cert); setLoading(false) })
  }, [profile])

  const enrolledCourseIds = progress.map((p) => p.course_id)
  const enrolledCourses = courses.filter((c) => enrolledCourseIds.includes(c.id))
  const inProgress = progress.filter((p) => p.percentage > 0 && p.percentage < 100)
  const avgProgress = progress.length > 0 ? Math.round(progress.reduce((sum, p) => sum + p.percentage, 0) / progress.length) : 0
  const getCourseProgress = (courseId: string) => progress.find((p) => p.course_id === courseId)?.percentage ?? 0

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, <span className="gradient-text">{profile?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Continue your learning journey</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Enrolled Courses" value={enrolledCourses.length} icon={<BookOpen size={20} />} color="indigo" />
        <StatCard title="In Progress" value={inProgress.length} icon={<Play size={20} />} color="gold" />
        <StatCard title="Avg. Progress" value={`${avgProgress}%`} icon={<TrendingUp size={20} />} color="green" />
        <StatCard title="Certificates" value={certs.length} icon={<Award size={20} />} color="indigo" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Continue Learning</h2>
            <Link to="/student-dashboard/courses" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1 transition-colors">
              View all <ChevronRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 glass rounded-xl animate-pulse" />)}</div>
          ) : inProgress.length > 0 ? (
            <div className="space-y-3">
              {inProgress.slice(0, 4).map((p) => {
                const course = courses.find((c) => c.id === p.course_id)
                if (!course) return null
                return (
                  <Link key={p.id} to={`/student-dashboard/learn/${p.course_id}`}
                    className="flex items-center gap-4 p-4 glass rounded-xl border border-gray-200 dark:border-white/8 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-200 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-gradient-to-br dark:from-indigo-900 dark:to-indigo-700 flex items-center justify-center flex-shrink-0">
                      <BookOpen size={20} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">{course.title}</p>
                      <ProgressBar value={p.percentage} size="sm" showPercent className="mt-2" />
                    </div>
                    <Play size={16} className="text-gray-400 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                  </Link>
                )
              })}
            </div>
          ) : enrolledCourses.length > 0 ? (
            <div className="text-center py-12 glass rounded-xl border border-gray-200 dark:border-white/8">
              <Play size={32} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Start a course to see your progress here</p>
            </div>
          ) : (
            <div className="text-center py-12 glass rounded-xl border border-gray-200 dark:border-white/8">
              <BookOpen size={32} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm mb-4">You haven't enrolled in any courses yet</p>
              <Link to="/courses" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium transition-colors hover:text-indigo-500">Browse Courses →</Link>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Certificates</h2>
            <Link to="/student-dashboard/certificates" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1 transition-colors">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          {certs.length > 0 ? (
            <div className="space-y-3">
              {certs.slice(0, 3).map((cert) => (
                <div key={cert.id} className="p-4 glass rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5">
                  <div className="flex items-start gap-3">
                    <Award size={18} className="text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{cert.course?.title ?? 'Course'}</p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5 font-mono">{cert.certificate_code}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(cert.issued_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass rounded-xl border border-gray-200 dark:border-white/8">
              <Award size={32} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Complete a course to earn your first certificate</p>
            </div>
          )}
        </div>
      </div>

      {enrolledCourses.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">My Courses</h2>
            <Link to="/courses" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">Find More →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrolledCourses.slice(0, 6).map((course) => <CourseCard key={course.id} course={course} progress={getCourseProgress(course.id)} />)}
          </div>
        </div>
      )}
    </div>
  )
}
