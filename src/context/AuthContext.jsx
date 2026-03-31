import React, { createContext, useContext, useEffect, useState } from 'react'
import { getIdTokenResult, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined)
  const [isAdmin, setIsAdmin] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser ?? null)

      if (!firebaseUser) {
        setIsAdmin(false)
        setAuthLoading(false)
        return
      }

      try {
        const tokenResult = await getIdTokenResult(firebaseUser, true)
        setIsAdmin(tokenResult.claims?.admin === true)
      } catch {
        setIsAdmin(false)
      } finally {
        setAuthLoading(false)
      }
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAdmin, authLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
