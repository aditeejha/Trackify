import React from 'react'
import { AlertCircle } from 'lucide-react'

export function ErrorBoundary({ error, resetError }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
        </div>
        <p className="text-gray-600 mb-6">{error?.message || 'An unexpected error occurred'}</p>
        <button
          onClick={resetError}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
