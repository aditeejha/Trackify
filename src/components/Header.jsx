import React from 'react'
import { Menu, X, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const { user, logout } = useAuthStore()

  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Trackify</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link to="/shipments" className="text-gray-600 hover:text-gray-900">
              Shipments
            </Link>
            <Link to="/reports" className="text-gray-600 hover:text-gray-900">
              Reports
            </Link>
            {user && (
              <div className="flex items-center gap-4 border-l pl-8">
                <span className="text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/dashboard" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
              Dashboard
            </Link>
            <Link to="/shipments" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
              Shipments
            </Link>
            <Link to="/reports" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
              Reports
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
