export type UserRole = 'student' | 'admin'

export interface Profile {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string | null
  created_at: string
}

export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  instructor: string
  category: string
  created_at: string
  lesson_count?: number
  enrolled?: boolean
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  youtube_url: string
  order_index: number
}

export interface Progress {
  id: string
  user_id: string
  course_id: string
  completed_lessons: string[]
  percentage: number
}

export interface Certificate {
  id: string
  user_id: string
  course_id: string
  certificate_code: string
  ai_message: string | null
  issued_at: string
  course?: Course
  profile?: Profile
}

export interface AnalyticsData {
  totalStudents: number
  totalCourses: number
  totalCertificates: number
  enrollmentsByMonth: { month: string; count: number }[]
  topCourses: { title: string; enrolled: number; completion: number }[]
  completionRates: { category: string; rate: number }[]
}
