import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingPage from './LoadingPage'

const ProtectedRoute = ({ children }) => {
  const { user, isAdmin, authLoading } = useAuth()

  if (authLoading || user === undefined) return <LoadingPage />

  if (!user || !isAdmin) return <Navigate to='/admin/login' replace />

  return children
}

export default ProtectedRoute
