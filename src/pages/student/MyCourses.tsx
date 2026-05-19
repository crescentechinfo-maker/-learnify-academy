import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ExternalLink } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getAllProgress } from '../../lib/progress'
import { getCourses } from '../../lib/courses'
import { CourseCard } from '../../components/CourseCard'
import type { Course, Progress } from '../../types'

export function MyCourses() {
  const { profile } = useAuth()
  const [progress, setProgress] = useState<Progress[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'all' | 'inprogress' | 'completed'>('all')

  useEffect(() => {
    if (!profile) return
    Promise.all([getAllProgress(profile.id), getCourses()]).then(([p, c]) => {
      setProgress(p); setCourses(c); setLoading(false)
    })
  }, [profile])

  const enrolledIds = progress.map((p) => p.course_id)
  const enrolledCourses = courses.filter((c) => enrolledIds.includes(c.id))
  const getProgress = (courseId: string) => progress.find((p) => p.course_id === courseId)?.percentage ?? 0

  const filtered = enrolledCourses.filter((c) => {
    const pct = getProgress(c.id)
    if (tab === 'inprogress') return pct > 0 && pct < 100
    if (tab === 'completed') return pct === 100
    return true
  })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Courses</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage your enrolled courses</p>
      </div>

      <div className="flex gap-2 mb-8">
        {[
          { key: 'all', label: `All (${enrolledCourses.length})` },
          { key: 'inprogress', label: `In Progress (${enrolledCourses.filter(c => { const p = getProgress(c.id); return p > 0 && p < 100 }).length})` },
          { key: 'completed', label: `Completed (${enrolledCourses.filter(c => getProgress(c.id) === 100).length})` },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              tab === t.key
                ? 'bg-indigo-600 text-white'
                : 'glass text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{[...Array(6)].map((_, i) => <div key={i} className="h-72 glass rounded-xl animate-pulse" />)}</div>
      ) : filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course) => <CourseCard key={course.id} course={course} progress={getProgress(course.id)} />)}
        </div>
      ) : (
        <div className="text-center py-24 glass rounded-2xl border border-gray-200 dark:border-white/8">
          <BookOpen size={48} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">
            {tab === 'all' ? 'No courses yet' : `No ${tab === 'inprogress' ? 'in-progress' : 'completed'} courses`}
          </h3>
          <p className="text-gray-400 text-sm mb-6">{tab === 'all' ? 'Start learning by enrolling in a course' : 'Keep learning to see courses here'}</p>
          <Link to="/courses" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium transition-colors">
            <ExternalLink size={16} />
            Browse Catalog
          </Link>
        </div>
      )}
    </div>
  )
}
