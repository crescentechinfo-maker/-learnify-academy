import { Link } from 'react-router-dom'
import { BookOpen, Users } from 'lucide-react'
import type { Course } from '../types'
import { Badge } from './ui/Badge'

interface CourseCardProps {
  course: Course
  progress?: number
}

export function CourseCard({ course, progress }: CourseCardProps) {
  return (
    <Link to={`/courses/${course.id}`} className="block group">
      <div className="glass rounded-xl overflow-hidden card-hover border border-gray-200 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-all duration-300">
        <div className="relative h-44 overflow-hidden bg-gradient-to-br from-indigo-100 dark:from-indigo-900/50 to-gray-100 dark:to-gray-900">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <BookOpen size={40} className="text-indigo-300 dark:text-indigo-500/40" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge variant="indigo">{course.category}</Badge>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
            {course.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
            {course.description}
          </p>

          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <BookOpen size={12} />
              {course.lesson_count ?? 0} lessons
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} />
              {course.instructor}
            </span>
          </div>

          {typeof progress === 'number' && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500 dark:text-gray-400">Progress</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">{progress}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
