import React from 'react'
import { Menu, X, LogOut, ChevronDown } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore, useAlertStore } from '../store'
import { PERMISSIONS, roleLabels, roleColors, roleHomeRoute } from '../auth/roles'

// Navigation model. `perm` gates visibility; items with no perm always show.
// `group` collapses links into a hover dropdown on desktop.
const NAV = [
  { label: 'Dashboard', dynamicHome: true, perm: PERMISSIONS.VIEW_DASHBOARD },
  { label: 'Live Tracking', to: '/tracking', perm: PERMISSIONS.VIEW_TRACKING },
  { label: 'Alerts', to: '/alerts', perm: PERMISSIONS.VIEW_ALERTS, badge: 'alerts' },
  {
    label: 'Fleet',
    group: [
      { label: 'Vehicles', to: '/vehicles', perm: PERMISSIONS.VIEW_VEHICLES },
      { label: 'Vehicle Health', to: '/health', perm: PERMISSIONS.VIEW_HEALTH },
      { label: 'Drivers', to: '/drivers', perm: PERMISSIONS.MANAGE_DRIVERS },
      { label: 'Assignments', to: '/assignments', perm: PERMISSIONS.MANAGE_ASSIGNMENTS },
      { label: 'Geofencing', to: '/geofencing', perm: PERMISSIONS.MANAGE_GEOFENCES },
    ],
  },
  {
    label: 'Operations',
    group: [
      { label: 'Shipments', to: '/shipments', perm: PERMISSIONS.VIEW_SHIPMENTS },
      { label: 'Documents', to: '/documents', perm: PERMISSIONS.VIEW_DOCUMENTS },
      { label: 'Maintenance', to: '/maintenance', perm: PERMISSIONS.MANAGE_MAINTENANCE },
      { label: 'Service Reminders', to: '/reminders', perm: PERMISSIONS.MANAGE_MAINTENANCE },
      { label: 'Fuel', to: '/fuel', perm: PERMISSIONS.MANAGE_FINANCE },
      { label: 'Expenses', to: '/expenses', perm: PERMISSIONS.MANAGE_FINANCE },
    ],
  },
  { label: 'Reports', to: '/reports', perm: PERMISSIONS.VIEW_REPORTS },
  { label: 'Admin', to: '/admin', perm: PERMISSIONS.MANAGE_USERS },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const { user, logout, can } = useAuthStore()
  const activeAlerts = useAlertStore((s) => s.alerts.filter((a) => a.status === 'active').length)
  const navigate = useNavigate()

  const home = roleHomeRoute[user?.role] || '/'

  const visible = (perm) => !perm || can(perm)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Flat list of leaf links a role can actually see (for the mobile menu).
  const flatLinks = NAV.flatMap((item) => {
    if (item.group) return item.group.filter((g) => visible(g.perm))
    if (!visible(item.perm)) return []
    return [{ ...item, to: item.dynamicHome ? home : item.to }]
  })

  const Badge = ({ name }) =>
    name === 'alerts' && activeAlerts > 0 ? (
      <span className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
        {activeAlerts}
      </span>
    ) : null

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-950/70 backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to={home} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <span className="font-bold text-white">T</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Trackify</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 lg:flex">
            {NAV.map((item) => {
              if (item.group) {
                const groupLinks = item.group.filter((g) => visible(g.perm))
                if (groupLinks.length === 0) return null
                return (
                  <div key={item.label} className="group relative">
                    <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                      {item.label} <ChevronDown className="h-4 w-4" />
                    </button>
                    <div className="invisible absolute left-0 z-50 mt-2 w-52 rounded-lg bg-white py-1 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                      {groupLinks.map((g) => (
                        <Link key={g.to} to={g.to} className="block px-4 py-2 text-gray-600 hover:bg-gray-50">{g.label}</Link>
                      ))}
                    </div>
                  </div>
                )
              }
              if (!visible(item.perm)) return null
              const to = item.dynamicHome ? home : item.to
              return (
                <Link key={item.label} to={to} className="flex items-center text-gray-600 hover:text-gray-900">
                  {item.label}
                  <Badge name={item.badge} />
                </Link>
              )
            })}

            {user && (
              <div className="flex items-center gap-3 border-l pl-6">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <span className="rounded-full px-2 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: roleColors[user.role] }}>
                    {roleLabels[user.role]}
                  </span>
                </div>
                <button onClick={handleLogout} title="Log out" className="text-gray-600 hover:text-gray-900">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="space-y-1 pb-4 lg:hidden">
            {user && (
              <div className="mb-2 flex items-center justify-between border-b px-4 py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <span className="text-xs" style={{ color: roleColors[user.role] }}>{roleLabels[user.role]}</span>
                </div>
                <button onClick={handleLogout} className="text-gray-600"><LogOut className="h-5 w-5" /></button>
              </div>
            )}
            {flatLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}
