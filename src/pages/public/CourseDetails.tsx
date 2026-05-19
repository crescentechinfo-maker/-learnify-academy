import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { BookOpen, Play, Clock, Users, Award, CheckCircle, ArrowRight } from 'lucide-react'
import { getCourse, getLessons } from '../../lib/courses'
import { enrollInCourse, getProgress } from '../../lib/progress'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { ProgressBar } from '../../components/ui/ProgressBar'
import type { Course, Lesson, Progress } from '../../types'

export function CourseDetails() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [progress, setProgress] = useState<Progress | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    if (!id) return
    Promise.all([getCourse(id), getLessons(id), user ? getProgress(user.id, id) : Promise.resolve(null)])
      .then(([c, l, p]) => { setCourse(c); setLessons(l); setProgress(p); setLoading(false) })
  }, [id, user])

  async function handleEnroll() {
    if (!user) { navigate('/login'); return }
    if (!id) return
    setEnrolling(true)
    try { await enrollInCourse(user.id, id); navigate(`/student-dashboard/learn/${id}`) }
    finally { setEnrolling(false) }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-64 glass rounded-2xl animate-pulse mb-8" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-gray-500">Course not found</h2>
        <Link to="/courses" className="text-indigo-600 dark:text-indigo-400 mt-4 inline-block">← Back to catalog</Link>
      </div>
    )
  }

  const isEnrolled = progress !== null
  const pct = progress?.percentage ?? 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative rounded-3xl overflow-hidden mb-10 bg-gradient-to-br from-indigo-100 dark:from-indigo-900/50 to-gray-100 dark:to-gray-900 border border-gray-200 dark:border-white/10">
        {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-20" />}
        <div className="relative p-8 sm:p-12">
          <Badge variant="indigo">{course.category}</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-4 mb-4 max-w-3xl leading-snug">{course.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">{course.description}</p>
          <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5"><Users size={15} /> {course.instructor}</span>
            <span className="flex items-center gap-1.5"><BookOpen size={15} /> {lessons.length} lessons</span>
            <span className="flex items-center gap-1.5"><Clock size={15} /> Self-paced</span>
            <span className="flex items-center gap-1.5"><Award size={15} /> Certificate included</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Course Curriculum</h2>
          <div className="flex flex-col gap-2">
            {lessons.map((lesson, index) => {
              const isCompleted = progress?.completed_lessons?.includes(lesson.id) ?? false
              return (
                <div key={lesson.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${isCompleted ? 'bg-indigo-50 dark:bg-indigo-600/10 border-indigo-200 dark:border-indigo-500/20' : 'glass border-gray-200 dark:border-white/8 hover:border-indigo-200 dark:hover:border-white/20'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold ${isCompleted ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400'}`}>
                    {isCompleted ? <CheckCircle size={16} /> : index + 1}
                  </div>
                  <p className={`font-medium text-sm flex-1 ${isCompleted ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-900 dark:text-white'}`}>{lesson.title}</p>
                  <Play size={14} className="text-gray-400 flex-shrink-0" />
                </div>
              )
            })}
            {lessons.length === 0 && <div className="text-center py-12 text-gray-400">No lessons added yet</div>}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-white/10 sticky top-24">
            {course.thumbnail && (
              <div className="rounded-xl overflow-hidden mb-5 aspect-video bg-gray-100 dark:bg-gray-800">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              </div>
            )}
            {isEnrolled ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Your Progress</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{pct}%</span>
                  </div>
                  <ProgressBar value={pct} color={pct === 100 ? 'green' : 'indigo'} />
                </div>
                <Link to={`/student-dashboard/learn/${course.id}`} className="block">
                  <Button className="w-full" size="lg" icon={<Play size={16} />}>
                    {pct > 0 ? 'Continue Learning' : 'Start Learning'}
                  </Button>
                </Link>
                {pct === 100 && (
                  <Link to="/student-dashboard/certificates" className="block">
                    <Button variant="gold" className="w-full" icon={<Award size={16} />}>View Certificate</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Free</div>
                  <p className="text-xs text-gray-500">Full lifetime access</p>
                </div>
                <Button onClick={handleEnroll} loading={enrolling} variant="gold" className="w-full" size="lg" icon={<ArrowRight size={16} />}>
                  {user ? 'Enroll Now' : 'Sign In to Enroll'}
                </Button>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {['Certificate of completion', 'Access on all devices', 'Self-paced learning', `${lessons.length} video lessons`].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
