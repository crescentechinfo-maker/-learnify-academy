import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Video, PlayCircle } from 'lucide-react'
import { getCourses, getLessons, createLesson, updateLesson, deleteLesson, extractYouTubeId } from '../../lib/courses'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Modal } from '../../components/ui/Modal'
import type { Course, Lesson } from '../../types'

const EMPTY_FORM = { title: '', youtube_url: '', course_id: '', order_index: 1 }

export function AdminLessons() {
  const [courses, setCourses] = useState<Course[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Lesson | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    getCourses().then((data) => {
      setCourses(data)
      if (data.length > 0) setSelectedCourse(data[0].id)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (selectedCourse) {
      getLessons(selectedCourse).then(setLessons)
    }
  }, [selectedCourse])

  function openCreate() {
    setEditing(null)
    setForm({ ...EMPTY_FORM, course_id: selectedCourse, order_index: lessons.length + 1 })
    setModalOpen(true)
  }

  function openEdit(lesson: Lesson) {
    setEditing(lesson)
    setForm({
      title: lesson.title,
      youtube_url: lesson.youtube_url,
      course_id: lesson.course_id,
      order_index: lesson.order_index,
    })
    setModalOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (editing) {
        await updateLesson(editing.id, form)
      } else {
        await createLesson(form)
      }
      const updated = await getLessons(selectedCourse)
      setLessons(updated)
      setModalOpen(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    await deleteLesson(deleteId)
    setDeleteId(null)
    const updated = await getLessons(selectedCourse)
    setLessons(updated)
  }

  const courseOptions = courses.map((c) => ({ value: c.id, label: c.title }))

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lessons</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage course lessons and YouTube links</p>
        </div>
        <Button onClick={openCreate} icon={<Plus size={16} />} disabled={!selectedCourse}>
          Add Lesson
        </Button>
      </div>

      {/* Course Selector */}
      {courses.length > 0 && (
        <div className="mb-6 max-w-sm">
          <Select
            label="Select Course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            options={courseOptions}
          />
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-16 glass rounded-xl animate-pulse" />)}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-24 glass rounded-2xl border border-white/8">
          <Video size={48} className="text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400">Create a course first to add lessons</p>
        </div>
      ) : (
        <div className="glass rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10">
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider w-10">#</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">YouTube URL</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {lessons.map((lesson) => {
                const videoId = extractYouTubeId(lesson.youtube_url)
                return (
                  <tr key={lesson.id} className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">{lesson.order_index}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {videoId ? (
                          <img
                            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                            alt={lesson.title}
                            className="w-16 h-10 object-cover rounded-lg flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Video size={16} className="text-gray-600" />
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{lesson.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <a
                        href={lesson.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        <PlayCircle size={14} />
                        {lesson.youtube_url.slice(0, 40)}...
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openEdit(lesson)} className="p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/20 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => setDeleteId(lesson.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/20 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {lessons.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-gray-500 text-sm">
                    No lessons yet. Click "Add Lesson" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Lesson' : 'Add Lesson'}>
        <div className="flex flex-col gap-4">
          <Select
            label="Course"
            value={form.course_id}
            onChange={(e) => setForm({ ...form, course_id: e.target.value })}
            options={courseOptions}
          />
          <Input
            label="Lesson Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Introduction to Components"
          />
          <Input
            label="YouTube URL"
            value={form.youtube_url}
            onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=..."
            icon={<PlayCircle size={16} />}
          />
          <Input
            label="Order Index"
            type="number"
            value={form.order_index}
            onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 1 })}
            placeholder="1"
          />
          {form.youtube_url && extractYouTubeId(form.youtube_url) && (
            <div className="rounded-xl overflow-hidden bg-black aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${extractYouTubeId(form.youtube_url)}`}
                title="Preview"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleSave} loading={saving} className="flex-1">
              {editing ? 'Save Changes' : 'Add Lesson'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Lesson" size="sm">
        <p className="text-gray-400 text-sm mb-6">Are you sure you want to delete this lesson?</p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteId(null)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1">Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
