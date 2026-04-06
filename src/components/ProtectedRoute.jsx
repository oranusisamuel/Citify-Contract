import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingPage from './LoadingPage'
import { resolveProtectedRouteState } from './protectedRouteState'

const ProtectedRoute = ({ children }) => {
  const { user, isAdmin, authLoading } = useAuth()
  const state = resolveProtectedRouteState({ user, isAdmin, authLoading })

  if (state === 'loading') return <LoadingPage />
  if (state === 'redirect') return <Navigate to='/admin/login' replace />

  return children
}

export default ProtectedRoute
