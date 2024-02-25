// Author: Oskari Niskanen

import React from 'react'

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'

// Route that checks if the user is authenticated.
export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
