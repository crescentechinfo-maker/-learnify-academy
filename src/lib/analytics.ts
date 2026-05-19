import { supabase } from './supabase'
import type { AnalyticsData } from '../types'

export async function getAnalytics(): Promise<AnalyticsData> {
  const [studentsRes, coursesRes, certsRes, progressRes] = await Promise.all([
    supabase.from('profiles').select('id, created_at', { count: 'exact' }).eq('role', 'student'),
    supabase.from('courses').select('id, title, category', { count: 'exact' }),
    supabase.from('certificates').select('id', { count: 'exact' }),
    supabase.from('progress').select('course_id, percentage, user_id'),
  ])

  const students = studentsRes.data || []
  const courses = coursesRes.data || []
  const progress = progressRes.data || []

  // Enrollments by month (last 6 months)
  const now = new Date()
  const enrollmentsByMonth = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const month = d.toLocaleString('default', { month: 'short' })
    const count = students.filter((s) => {
      const created = new Date(s.created_at)
      return created.getMonth() === d.getMonth() && created.getFullYear() === d.getFullYear()
    }).length
    return { month, count }
  })

  // Top courses
  const topCourses = courses.slice(0, 5).map((c) => {
    const courseProgress = progress.filter((p) => p.course_id === c.id)
    const enrolled = new Set(courseProgress.map((p) => p.user_id)).size
    const completed = courseProgress.filter((p) => p.percentage === 100).length
    const completion = enrolled > 0 ? Math.round((completed / enrolled) * 100) : 0
    return { title: c.title, enrolled, completion }
  })

  // Completion rates by category
  const categories = [...new Set(courses.map((c) => c.category))]
  const completionRates = categories.map((category) => {
    const categoryCourseIds = courses.filter((c) => c.category === category).map((c) => c.id)
    const categoryProgress = progress.filter((p) => categoryCourseIds.includes(p.course_id))
    const avgRate = categoryProgress.length
      ? Math.round(categoryProgress.reduce((sum, p) => sum + p.percentage, 0) / categoryProgress.length)
      : 0
    return { category, rate: avgRate }
  })

  return {
    totalStudents: studentsRes.count || 0,
    totalCourses: coursesRes.count || 0,
    totalCertificates: certsRes.count || 0,
    enrollmentsByMonth,
    topCourses,
    completionRates,
  }
}
