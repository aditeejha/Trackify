import React from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Truck, MapPin, Bell, Heart, FileText, Fuel, ArrowRight } from 'lucide-react'
import { mockVehicles, mockDrivers } from '../../data/fleetData'
import { mockVehicleHealth, mockDocuments, daysUntil, healthStatus } from '../../data/operationsData'
import { useAlertStore, useTrackingStore } from '../../store'

const utilization = [
  { day: 'Mon', active: 2 }, { day: 'Tue', active: 3 }, { day: 'Wed', active: 2 },
  { day: 'Thu', active: 3 }, { day: 'Fri', active: 3 }, { day: 'Sat', active: 1 }, { day: 'Sun', active: 1 },
]

const StatCard = ({ icon: Icon, label, value, color, to }) => (
  <Link to={to || '#'} className="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="rounded-lg p-3" style={{ backgroundColor: `${color}20` }}>
        <Icon className="h-6 w-6" style={{ color }} />
      </div>
    </div>
  </Link>
)

export default function FleetManagerDashboard() {
  const activeAlerts = useAlertStore((s) => s.alerts.filter((a) => a.status === 'active'))
  const telemetry = useTrackingStore((s) => s.telemetry)
  const moving = telemetry.filter((t) => t.status === 'moving').length
  const expiringDocs = mockDocuments.filter((d) => { const x = daysUntil(d.expiryDate); return x >= 0 && x <= 30 })
  const needsAttention = mockVehicleHealth.filter((h) => h.overallScore < 60)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Fleet Manager Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Operational overview of your fleet, drivers and live activity.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Truck} label="Vehicles" value={mockVehicles.length} color="#2563eb" to="/vehicles" />
        <StatCard icon={MapPin} label="On the Move" value={moving} color="#10b981" to="/tracking" />
        <StatCard icon={Bell} label="Active Alerts" value={activeAlerts.length} color="#ef4444" to="/alerts" />
        <StatCard icon={Fuel} label="Drivers" value={mockDrivers.length} color="#f59e0b" to="/drivers" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Vehicle Utilization (this week)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={utilization}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="active" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg bg-white p-5 shadow">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold text-gray-900"><Bell className="h-4 w-4 text-red-500" /> Recent Alerts</h3>
              <Link to="/alerts" className="text-xs text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="space-y-2">
              {activeAlerts.slice(0, 3).map((a) => (
                <div key={a.id} className="rounded-lg bg-gray-50 p-2 text-sm">
                  <p className="font-medium text-gray-800">{a.title}</p>
                  <p className="text-xs text-gray-500">{a.timestamp}</p>
                </div>
              ))}
              {activeAlerts.length === 0 && <p className="text-sm text-gray-500">No active alerts.</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900"><Heart className="h-5 w-5 text-red-500" /> Vehicles Needing Attention</h2>
          {needsAttention.length === 0 ? (
            <p className="text-sm text-gray-500">All vehicles in good health.</p>
          ) : (
            <div className="space-y-3">
              {needsAttention.map((h) => {
                const v = mockVehicles.find((mv) => mv.id === h.vehicleId)
                const status = healthStatus(h.overallScore)
                return (
                  <Link key={h.vehicleId} to="/health" className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">{v?.licensePlate}</p>
                      <p className="text-xs text-gray-500">{v?.make} {v?.model}</p>
                    </div>
                    <span className="rounded-full px-3 py-1 text-xs font-medium text-white" style={{ backgroundColor: status.color }}>{h.overallScore} · {status.label}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900"><FileText className="h-5 w-5 text-blue-500" /> Documents Expiring Soon</h2>
          {expiringDocs.length === 0 ? (
            <p className="text-sm text-gray-500">No documents expiring in the next 30 days.</p>
          ) : (
            <div className="space-y-3">
              {expiringDocs.map((d) => (
                <Link key={d.id} to="/documents" className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{d.name}</p>
                    <p className="text-xs text-gray-500">Expires {d.expiryDate}</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">{daysUntil(d.expiryDate)}d</span>
                </Link>
              ))}
            </div>
          )}
          <Link to="/documents" className="mt-4 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">Manage documents <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </div>
  )
}
