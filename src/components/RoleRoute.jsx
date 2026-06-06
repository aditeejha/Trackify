import React from 'react'
import { Navigate } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { useAuthStore } from '../store'
import { roleHomeRoute } from '../auth/roles'

// Route guard that enforces authentication and, optionally, a permission.
// - Not authenticated  -> redirect to /login
// - Authenticated but lacking the required permission -> Access Denied screen
export function RoleRoute({ permission, children }) {
  const { isAuthenticated, user, can } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (permission && !can(permission)) {
    const home = roleHomeRoute[user?.role] || '/'
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <ShieldAlert className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="mt-2 text-gray-600">
          Your role doesn't have permission to view this page.
        </p>
        <a href={home} className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700">
          Go to your dashboard
        </a>
      </div>
    )
  }

  return children
}
