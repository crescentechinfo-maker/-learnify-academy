import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, BookOpen } from 'lucide-react'
import { getCourses } from '../../lib/courses'
import { CourseCard } from '../../components/CourseCard'
import type { Course } from '../../types'

const CATEGORIES = ['All', 'Web Development', 'Data Science', 'Design', 'Mobile', 'AI/ML', 'Business', 'Marketing']

export function CourseCatalog() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filtered, setFiltered] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    getCourses().then((data) => { setCourses(data); setFiltered(data); setLoading(false) })
  }, [])

  useEffect(() => {
    let result = courses
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q))
    }
    if (category !== 'All') result = result.filter((c) => c.category === category)
    setFiltered(result)
  }, [search, category, courses])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Course Catalog</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Explore {courses.length}+ expert-led courses. Learn at your own pace.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses, topics, instructors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <SlidersHorizontal size={16} />
          <span className="text-sm">{filtered.length} courses</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              category === cat
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <div key={i} className="glass rounded-xl h-72 animate-pulse" />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((course) => <CourseCard key={course.id} course={course} />)}
        </div>
      ) : (
        <div className="text-center py-24">
          <BookOpen size={48} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">No courses found</h3>
          <p className="text-gray-400 text-sm">Try a different search term or category</p>
        </div>
      )}
    </div>
  )
}
