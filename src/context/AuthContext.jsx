import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { api } from '../utils/api'
import { auth, googleProvider, isFirebaseConfigured, mapFirebaseUser } from '../lib/firebase'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { isAdminEmail } from '../config/admin'

const AuthContext = createContext()

function mapSupabaseUser(sessionUser, profile) {
  return {
    id: sessionUser.id,
    name: profile?.name || sessionUser.user_metadata?.name || sessionUser.email?.split('@')[0],
    email: sessionUser.email,
  }
}

function withAdminFlag(user) {
  if (!user?.email) return user
  return { ...user, isAdmin: isAdminEmail(user.email) }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isFirebaseConfigured()) {
      const unsub = onAuthStateChanged(auth, (fbUser) => {
        setUser(fbUser ? withAdminFlag(mapFirebaseUser(fbUser)) : null)
        setLoading(false)
      })
      return unsub
    }

    if (isSupabaseConfigured()) {
      let cancelled = false

      async function loadSession() {
        const { data: { session } } = await supabase.auth.getSession()
        if (cancelled) return
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, email')
            .eq('id', session.user.id)
            .maybeSingle()
          setUser(withAdminFlag(mapSupabaseUser(session.user, profile)))
        }
        setLoading(false)
      }

      loadSession()

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, email')
            .eq('id', session.user.id)
            .maybeSingle()
          setUser(withAdminFlag(mapSupabaseUser(session.user, profile)))
        } else {
          setUser(null)
        }
      })

      return () => {
        cancelled = true
        subscription.unsubscribe()
      }
    }

    const token = localStorage.getItem('token')
    const stored = localStorage.getItem('user')
    if (token && stored) {
      try {
        setUser(withAdminFlag(JSON.parse(stored)))
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
    return undefined
  }, [])

  const login = useCallback(async (email, password) => {
    if (isFirebaseConfigured()) {
      const { user: fbUser } = await signInWithEmailAndPassword(auth, email, password)
      const mapped = withAdminFlag(mapFirebaseUser(fbUser))
      setUser(mapped)
      return { user: mapped }
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, email')
        .eq('id', data.user.id)
        .maybeSingle()
      const mapped = withAdminFlag(mapSupabaseUser(data.user, profile))
      setUser(mapped)
      return { user: mapped, token: data.session.access_token }
    }

    const res = await api.login({ email, password })
    localStorage.setItem('token', res.token)
    localStorage.setItem('user', JSON.stringify(res.user))
    const mapped = withAdminFlag(res.user)
    setUser(mapped)
    return { user: mapped, token: res.token }
  }, [])

  const loginWithGoogle = useCallback(async () => {
    if (!isFirebaseConfigured()) {
      throw new Error('Google sign-in requires Firebase configuration')
    }
    const { user: fbUser } = await signInWithPopup(auth, googleProvider)
    const mapped = withAdminFlag(mapFirebaseUser(fbUser))
    setUser(mapped)
    return { user: mapped }
  }, [])

  const register = useCallback(async (formData) => {
    if (isFirebaseConfigured()) {
      const { user: fbUser } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      )
      if (formData.name) {
        await updateProfile(fbUser, { displayName: formData.name })
      }
      const mapped = withAdminFlag(mapFirebaseUser({ ...fbUser, displayName: formData.name || fbUser.displayName }))
      setUser(mapped)
      return { user: mapped }
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { name: formData.name } },
      })
      if (error) throw error
      if (!data.user) throw new Error('Registration failed')
      const mapped = withAdminFlag(mapSupabaseUser(data.user, { name: formData.name }))
      setUser(mapped)
      return { user: mapped, token: data.session?.access_token }
    }

    const res = await api.register(formData)
    localStorage.setItem('token', res.token)
    localStorage.setItem('user', JSON.stringify(res.user))
    const mapped = withAdminFlag(res.user)
    setUser(mapped)
    return { user: mapped, token: res.token }
  }, [])

  const resetPassword = useCallback(async (email) => {
    if (isFirebaseConfigured()) {
      await sendPasswordResetEmail(auth, email.trim())
      return
    }

    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/en/account`,
      })
      if (error) throw error
      return
    }

    throw new Error('Password reset requires Firebase or Supabase configuration')
  }, [])

  const logout = useCallback(async () => {
    if (isFirebaseConfigured()) {
      await signOut(auth)
    } else if (isSupabaseConfigured()) {
      await supabase.auth.signOut()
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        register,
        resetPassword,
        logout,
        isAuthenticated: !!user,
        isAdmin: !!user?.isAdmin,
        isFirebaseEnabled: isFirebaseConfigured(),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
