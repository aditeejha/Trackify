import React, { useState } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, Truck, ShieldCheck, Bell, Plus, UserCog } from 'lucide-react'
import { Link } from 'react-router-dom'
import { mockUsers } from '../../data/operationsData'
import { mockVehicles, mockDrivers } from '../../data/fleetData'
import { useAlertStore, useNotificationStore } from '../../store'
import { ROLES, roleLabels, roleColors } from '../../auth/roles'

const StatCard = ({ icon: Icon, label, value, color, to }) => {
  const inner = (
    <div className="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="rounded-lg p-3" style={{ backgroundColor: `${color}20` }}>
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
      </div>
    </div>
  )
  return to ? <Link to={to}>{inner}</Link> : inner
}

export default function AdminDashboard() {
  const alerts = useAlertStore((s) => s.alerts)
  const addNotification = useNotificationStore((s) => s.addNotification)
  const [users] = useState(mockUsers)

  const usersByRole = Object.values(ROLES).map((role) => ({
    name: roleLabels[role],
    value: users.filter((u) => u.role === role).length,
    color: roleColors[role],
  }))

  const activeAlerts = alerts.filter((a) => a.status === 'active').length

  const fleetStatus = [
    { name: 'Active', value: mockVehicles.filter((v) => v.status === 'active').length },
    { name: 'Maintenance', value: mockVehicles.filter((v) => v.status === 'maintenance').length },
    { name: 'Inactive', value: mockVehicles.filter((v) => v.status === 'inactive').length },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">System-wide overview, user management and configuration.</p>
        </div>
        <button
          onClick={() => addNotification({ type: 'info', message: 'User invite flow (demo)' })}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" /> Add User
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value={users.length} color="#8b5cf6" />
        <StatCard icon={Truck} label="Vehicles" value={mockVehicles.length} color="#2563eb" to="/vehicles" />
        <StatCard icon={ShieldCheck} label="Drivers" value={mockDrivers.length} color="#10b981" to="/drivers" />
        <StatCard icon={Bell} label="Active Alerts" value={activeAlerts} color="#ef4444" to="/alerts" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Users by Role</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={usersByRole} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                {usersByRole.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Fleet Status</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={fleetStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
          <UserCog className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Name', 'Email', 'Role', 'Status', 'Last Active'].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                <td className="px-6 py-4">
                  <span className="rounded-full px-3 py-1 text-xs font-medium text-white" style={{ backgroundColor: roleColors[u.role] }}>
                    {roleLabels[u.role]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{u.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
