import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { useAuthStore, useNotificationStore } from '../store'

export default function LoginPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  const addNotification = useNotificationStore((state) => state.addNotification)
  const [email, setEmail] = useState('demo@trackify.com')
  const [password, setPassword] = useState('demo123')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Mock login
      await new Promise((resolve) => setTimeout(resolve, 500))
      const user = { email, id: '1' }
      setUser(user)
      localStorage.setItem('authToken', 'mock-token-123')
      addNotification({ type: 'success', message: 'Logged in successfully!' })
      navigate('/dashboard')
    } catch (error) {
      addNotification({ type: 'error', message: 'Login failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-white">T</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Trackify</h1>
            <p className="text-gray-600 mt-2">Shipment Tracking System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Demo credentials:
            <br />
            Email: demo@trackify.com
            <br />
            Password: demo123
          </p>
        </div>
      </div>
    </div>
  )
}
