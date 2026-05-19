import { supabase } from './supabase'
import type { Progress } from '../types'

export async function getProgress(userId: string, courseId: string): Promise<Progress | null> {
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single()

  if (error) return null
  return data
}

export async function getAllProgress(userId: string): Promise<Progress[]> {
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  return data || []
}

export async function markLessonComplete(
  userId: string,
  courseId: string,
  lessonId: string,
  totalLessons: number
) {
  const existing = await getProgress(userId, courseId)

  if (existing) {
    const completedLessons = Array.from(new Set([...existing.completed_lessons, lessonId]))
    const percentage = Math.round((completedLessons.length / totalLessons) * 100)

    const { data, error } = await supabase
      .from('progress')
      .update({ completed_lessons: completedLessons, percentage })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error
    return data
  } else {
    const percentage = Math.round((1 / totalLessons) * 100)

    const { data, error } = await supabase
      .from('progress')
      .insert({
        user_id: userId,
        course_id: courseId,
        completed_lessons: [lessonId],
        percentage,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
}

export async function getEnrolledCourses(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('progress')
    .select('course_id')
    .eq('user_id', userId)

  if (error) return []
  return (data || []).map((p) => p.course_id)
}

export async function enrollInCourse(userId: string, courseId: string) {
  const existing = await getProgress(userId, courseId)
  if (existing) return existing

  const { data, error } = await supabase
    .from('progress')
    .insert({ user_id: userId, course_id: courseId, completed_lessons: [], percentage: 0 })
    .select()
    .single()

  if (error) throw error
  return data
}
