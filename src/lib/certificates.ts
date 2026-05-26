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
  const { data } = await supabase
    .from('certificates')
    .select('*, course:courses(*)')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single()
  return data ?? null
}

export async function getUserCertificates(userId: string): Promise<Certificate[]> {
  const { data, error } = await supabase
    .from('certificates')
    .select('*, course:courses(*)')
    .eq('user_id', userId)
    .order('issued_at', { ascending: false })

  if (error) {
    console.error('getUserCertificates error:', error)
    return []
  }
  return data || []
}

export async function issueCertificate(userId: string, courseId: string): Promise<Certificate> {
  // Return existing cert if already issued
  const existing = await getCertificate(userId, courseId)
  if (existing) return existing

  // Step 1: Insert cert WITHOUT ai_message — this always works
  const { data: cert, error: insertError } = await supabase
    .from('certificates')
    .insert({
      user_id: userId,
      course_id: courseId,
      certificate_code: generateCertCode(),
      issued_at: new Date().toISOString(),
    })
    .select('*, course:courses(*)')
    .single()

  if (insertError) {
    console.error('Certificate insert error:', insertError)
    throw insertError
  }

  // Step 2: Generate AI message and update — failure here won't break the cert
  try {
    const { data: courseData } = await supabase.from('courses').select('title').eq('id', courseId).single()
    const { data: profileData } = await supabase.from('profiles').select('name').eq('id', userId).single()

    const ai_message = await generateCertificateMessage(
      profileData?.name ?? 'Student',
      courseData?.title ?? 'the course'
    )

    if (ai_message) {
      await supabase
        .from('certificates')
        .update({ ai_message })
        .eq('id', cert.id)
      cert.ai_message = ai_message
    }
  } catch (aiError) {
    console.error('AI message generation error (cert still saved):', aiError)
  }

  return cert
}

export async function getAllCertificates(): Promise<Certificate[]> {
  const { data, error } = await supabase
    .from('certificates')
    .select('*, course:courses(*), profile:profiles(*)')
    .order('issued_at', { ascending: false })

  if (error) {
    console.error('getAllCertificates error:', error)
    return []
  }
  return data || []
}
