import { useEffect, useState } from 'react'
import { Users, Search, Trash2, ChevronDown, ChevronUp, BookOpen, Award } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import type { Profile } from '../../types'

interface Enrollment {
  course_id: string
  course_title: string
  category: string
  percentage: number
}

interface StudentWithEnrollments extends Profile {
  enrollments: Enrollment[]
}

export function AdminStudents() {
  const [students, setStudents] = useState<StudentWithEnrollments[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<StudentWithEnrollments | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .order('created_at', { ascending: false })

    const { data: progress } = await supabase
      .from('progress')
      .select('user_id, course_id, percentage')

    const { data: courses } = await supabase
      .from('courses')
      .select('id, title, category')

    const courseMap = Object.fromEntries((courses ?? []).map((c) => [c.id, c]))

    const merged: StudentWithEnrollments[] = (profiles ?? []).map((p) => ({
      ...p,
      enrollments: (progress ?? [])
        .filter((pr) => pr.user_id === p.id && courseMap[pr.course_id])
        .map((pr) => ({
          course_id: pr.course_id,
          course_title: courseMap[pr.course_id]?.title ?? 'Unknown',
          category: courseMap[pr.course_id]?.category ?? '',
          percentage: pr.percentage,
        })),
    }))

    setStudents(merged)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    await supabase.from('profiles').delete().eq('id', deleteTarget.id)
    setDeleteTarget(null)
    setDeleting(false)
    await load()
  }

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Students</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{students.length} registered students</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 glass rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="glass rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10">
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filtered.map((student) => (
                <>
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors cursor-pointer"
                    onClick={() => setExpanded(expanded === student.id ? null : student.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          {student.name?.charAt(0)?.toUpperCase() ?? 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</p>
                          <p className="text-xs text-gray-500 md:hidden">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">{student.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                      {new Date(student.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                        <BookOpen size={11} /> {student.enrollments.length} course{student.enrollments.length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteTarget(student) }}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={15} />
                        </button>
                        {expanded === student.id
                          ? <ChevronUp size={15} className="text-gray-400" />
                          : <ChevronDown size={15} className="text-gray-400" />}
                      </div>
                    </td>
                  </tr>

                  {expanded === student.id && (
                    <tr key={`${student.id}-expanded`} className="bg-gray-50 dark:bg-white/2">
                      <td colSpan={5} className="px-6 py-4">
                        {student.enrollments.length === 0 ? (
                          <p className="text-sm text-gray-400 italic">No courses enrolled yet.</p>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Enrolled Courses</p>
                            {student.enrollments.map((e) => (
                              <div key={e.course_id} className="flex items-center justify-between bg-white dark:bg-white/5 rounded-xl px-4 py-3 border border-gray-200 dark:border-white/8">
                                <div className="flex items-center gap-3">
                                  <BookOpen size={14} className="text-indigo-400 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{e.course_title}</p>
                                    <p className="text-xs text-gray-500">{e.category}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  {e.percentage === 100 && (
                                    <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                      <Award size={12} /> Completed
                                    </span>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <div className="w-24 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-indigo-500 rounded-full"
                                        style={{ width: `${e.percentage}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-gray-500 w-8 text-right">{e.percentage}%</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <Users size={32} className="text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No students found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Student" size="sm">
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
          Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{deleteTarget?.name}</span>?
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          This will remove their profile, progress, and certificates permanently.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting} className="flex-1">Delete Student</Button>
        </div>
      </Modal>
    </div>
  )
}
