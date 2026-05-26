import { supabase } from './supabase'
import { generateCertificateMessage } from './ai'
import type { Certificate } from '../types'

function generateCertCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const segments = [4, 4, 4].map(() =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  )
  return `LRNFY-${segments.join('-')}`
}

export async function getCertificate(userId: string, courseId: string): Promise<Certificate | null> {
  const { data, error } = await supabase
    .from('certificates')
    .select('*, course:courses(*), profile:profiles(*)')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single()

  if (error) return null
  return data
}

export async function getUserCertificates(userId: string): Promise<Certificate[]> {
  const { data, error } = await supabase
    .from('certificates')
    .select('*, course:courses(*)')
    .eq('user_id', userId)
    .order('issued_at', { ascending: false })

  if (error) return []
  return data || []
}

export async function issueCertificate(userId: string, courseId: string): Promise<Certificate> {
  const existing = await getCertificate(userId, courseId)
  if (existing) return existing

  const { data: courseData } = await supabase.from('courses').select('title').eq('id', courseId).single()
  const { data: profileData } = await supabase.from('profiles').select('name').eq('id', userId).single()

  const ai_message = await generateCertificateMessage(
    profileData?.name ?? 'Student',
    courseData?.title ?? 'the course'
  )

  const basePayload = {
    user_id: userId,
    course_id: courseId,
    certificate_code: generateCertCode(),
    issued_at: new Date().toISOString(),
  }

  // Try with ai_message first, fall back without it if column doesn't exist yet
  let result = await supabase
    .from('certificates')
    .insert({ ...basePayload, ...(ai_message ? { ai_message } : {}) })
    .select('*, course:courses(*), profile:profiles(*)')
    .single()

  if (result.error?.message?.includes('ai_message')) {
    result = await supabase
      .from('certificates')
      .insert(basePayload)
      .select('*, course:courses(*), profile:profiles(*)')
      .single()
  }

  if (result.error) throw result.error
  return result.data
}

export async function getAllCertificates(): Promise<Certificate[]> {
  const { data, error } = await supabase
    .from('certificates')
    .select('*, course:courses(*), profile:profiles(*)')
    .order('issued_at', { ascending: false })

  if (error) return []
  return data || []
}
