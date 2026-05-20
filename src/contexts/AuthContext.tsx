import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { getProfile, signIn, signOut, signUp } from '../lib/auth'
import type { Profile } from '../types'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  login: (email: string, password: string) => Promise<Profile | null>
  register: (email: string, password: string, name: string) => Promise<any>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
  isAdmin: boolean
  isStudent: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(userId: string) {
    const data = await getProfile(userId)
    setProfile(data)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function login(email: string, password: string) {
    const data = await signIn(email, password)
    if (data.user) {
      const p = await getProfile(data.user.id)
      setProfile(p)
      return p
    }
    return null
  }

  async function register(email: string, password: string, name: string) {
    return await signUp(email, password, name)
  }

  async function logout() {
    await signOut()
    setProfile(null)
  }

  async function refreshProfile() {
    if (user) await loadProfile(user.id)
  }

  const isAdmin = profile?.role === 'admin'
  const isStudent = profile?.role === 'student'

  return (
    <AuthContext.Provider value={{
      user, profile, session, loading,
      login, register, logout, refreshProfile,
      isAdmin, isStudent,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
