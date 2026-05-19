import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle, Circle, ChevronLeft, ChevronRight, BookOpen, Award } from 'lucide-react'
import { getCourse, getLessons, extractYouTubeId } from '../../lib/courses'
import { getProgress, markLessonComplete } from '../../lib/progress'
import { issueCertificate } from '../../lib/certificates'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'
import type { Course, Lesson, Progress } from '../../types'

export function LessonPlayer() {
  const { courseId } = useParams<{ courseId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [progress, setProgress] = useState<Progress | null>(null)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [marking, setMarking] = useState(false)
  const [loading, setLoading] = useState(true)
  const [certIssued, setCertIssued] = useState(false)

  useEffect(() => {
    if (!courseId || !user) return
    Promise.all([getCourse(courseId), getLessons(courseId), getProgress(user.id, courseId)])
      .then(([c, l, p]) => {
        setCourse(c); setLessons(l); setProgress(p)
        const firstUncompleted = l.find((lesson) => !p?.completed_lessons?.includes(lesson.id))
        setActiveLesson(firstUncompleted ?? l[0] ?? null)
        setLoading(false)
      })
  }, [courseId, user])

  async function handleMarkComplete() {
    if (!user || !courseId || !activeLesson || !progress) return
    setMarking(true)
    try {
      const updated = await markLessonComplete(user.id, courseId, activeLesson.id, lessons.length)
      setProgress(updated)
      if (updated.percentage === 100) {
        await issueCertificate(user.id, courseId)
        setCertIssued(true)
      }
      const currentIndex = lessons.findIndex((l) => l.id === activeLesson.id)
      if (currentIndex < lessons.length - 1) setActiveLesson(lessons[currentIndex + 1])
    } finally { setMarking(false) }
  }

  const isCompleted = (lessonId: string) => progress?.completed_lessons?.includes(lessonId) ?? false
  const currentIndex = lessons.findIndex((l) => l.id === activeLesson?.id)
  const videoId = activeLesson ? extractYouTubeId(activeLesson.youtube_url) : null

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" /></div>
  }

  if (!course) return <div className="text-center py-24 text-gray-500">Course not found</div>

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/student-dashboard/courses')}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">{course.title}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-500">{progress?.completed_lessons?.length ?? 0}/{lessons.length} lessons</span>
            <ProgressBar value={progress?.percentage ?? 0} size="sm" className="w-32" />
            <span className="text-xs text-indigo-600 dark:text-indigo-400">{progress?.percentage ?? 0}%</span>
          </div>
        </div>
      </div>

      {certIssued && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-gradient-to-r dark:from-amber-500/20 dark:to-yellow-400/10 border border-amber-200 dark:border-amber-500/30 flex items-center gap-4">
          <Award size={28} className="text-amber-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white">Congratulations! Course Completed!</p>
            <p className="text-sm text-amber-700 dark:text-amber-300">Your certificate has been issued.</p>
          </div>
          <Button onClick={() => navigate('/student-dashboard/certificates')} variant="gold" size="sm" icon={<Award size={15} />}>
            View Certificate
          </Button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {videoId ? (
            <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl shadow-black/30">
              <iframe
                key={videoId}
                width="100%" height="100%"
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                title={activeLesson?.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen className="w-full h-full"
              />
            </div>
          ) : (
            <div className="aspect-video rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-white/10 flex items-center justify-center">
              <div className="text-center">
                <BookOpen size={40} className="text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No video available for this lesson</p>
              </div>
            </div>
          )}

          <div className="glass rounded-2xl p-5 border border-gray-200 dark:border-white/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{activeLesson?.title}</h2>
                <p className="text-sm text-gray-500 mt-1">Lesson {currentIndex + 1} of {lessons.length}</p>
              </div>
              {activeLesson && !isCompleted(activeLesson.id) && (
                <Button onClick={handleMarkComplete} loading={marking} icon={<CheckCircle size={16} />} size="sm">Mark Complete</Button>
              )}
              {activeLesson && isCompleted(activeLesson.id) && (
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                  <CheckCircle size={16} /> Completed
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
              <Button variant="secondary" size="sm" icon={<ChevronLeft size={15} />} disabled={currentIndex === 0} onClick={() => setActiveLesson(lessons[currentIndex - 1])}>Previous</Button>
              <Button variant="secondary" size="sm" disabled={currentIndex === lessons.length - 1} onClick={() => setActiveLesson(lessons[currentIndex + 1])}>Next <ChevronRight size={15} /></Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="glass rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-white/10">
              <h3 className="font-semibold text-gray-900 dark:text-white">Course Content</h3>
              <p className="text-xs text-gray-500 mt-0.5">{lessons.length} lessons</p>
            </div>
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
              {lessons.map((lesson, index) => {
                const completed = isCompleted(lesson.id)
                const active = activeLesson?.id === lesson.id
                return (
                  <button key={lesson.id} onClick={() => setActiveLesson(lesson)}
                    className={`w-full flex items-start gap-3 p-4 text-left transition-all duration-200 border-b border-gray-100 dark:border-white/5 last:border-0 ${
                      active ? 'bg-indigo-50 dark:bg-indigo-600/20 border-l-2 border-l-indigo-500' : 'hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {completed ? <CheckCircle size={16} className="text-emerald-500" /> : <Circle size={16} className={active ? 'text-indigo-500' : 'text-gray-300 dark:text-gray-600'} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium leading-tight ${active ? 'text-indigo-700 dark:text-indigo-300' : completed ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                        {lesson.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">Lesson {index + 1}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
