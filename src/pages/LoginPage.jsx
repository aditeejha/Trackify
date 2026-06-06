import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Shield, Truck, User, Wrench } from 'lucide-react'
import { useAuthStore, useNotificationStore } from '../store'
import { demoUsers, roleHomeRoute, roleLabels, ROLES } from '../auth/roles'

const roleIcons = {
  [ROLES.ADMIN]: Shield,
  [ROLES.FLEET_MANAGER]: Truck,
  [ROLES.DRIVER]: User,
  [ROLES.MECHANIC]: Wrench,
}

export default function LoginPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  const addNotification = useNotificationStore((state) => state.addNotification)
  const [email, setEmail] = useState('admin@trackify.com')
  const [password, setPassword] = useState('demo123')
  const [loading, setLoading] = useState(false)

  const signIn = async (account) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 400))
      const { password: _pw, ...user } = account
      setUser(user)
      localStorage.setItem('authToken', `mock-token-${account.id}`)
      addNotification({ type: 'success', message: `Welcome, ${account.name}!` })
      navigate(roleHomeRoute[account.role] || '/')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    // Match against a demo account; fall back to a generic fleet-manager login.
    const account =
      demoUsers.find((u) => u.email === email && u.password === password) ||
      (email && password ? { id: 'guest', name: email.split('@')[0], email, role: ROLES.FLEET_MANAGER } : null)
    if (!account) {
      addNotification({ type: 'error', message: 'Invalid credentials' })
      return
    }
    signIn(account)
  }

  const quickLogin = (account) => {
    setEmail(account.email)
    setPassword(account.password)
    signIn(account)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* ambient blue glow backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
      </div>
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_8px_30px_-8px_rgba(59,130,246,0.8)]">
              <span className="text-3xl font-bold text-white">T</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-white">Trackify</h1>
            <p className="mt-1 text-gray-400">Fleet Management Platform</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <p className="mb-3 text-center text-sm text-gray-500">Or sign in as a demo role</p>
            <div className="grid grid-cols-2 gap-2">
              {demoUsers.map((account) => {
                const Icon = roleIcons[account.role]
                return (
                  <button
                    key={account.id}
                    onClick={() => quickLogin(account)}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-left text-sm hover:border-blue-400 hover:bg-blue-50 disabled:opacity-50"
                  >
                    <Icon className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-gray-700">{roleLabels[account.role]}</span>
                  </button>
                )
              })}
            </div>
            <p className="mt-3 text-center text-xs text-gray-400">All demo accounts use password: demo123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
