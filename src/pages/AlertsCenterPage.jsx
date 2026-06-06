import React, { useState } from 'react'
import { Bell, Check, CheckCheck, AlertTriangle, Info, ShieldAlert } from 'lucide-react'
import { useAlertStore, useAuthStore, useNotificationStore } from '../store'
import { alertTypes, alertSeverities } from '../data/operationsData'
import { mockVehicles } from '../data/fleetData'
import { PERMISSIONS } from '../auth/roles'

const severityIcon = {
  critical: ShieldAlert,
  warning: AlertTriangle,
  info: Info,
}

const StatCard = ({ label, value, color }) => (
  <div className="rounded-lg bg-white p-4 shadow">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="mt-1 text-2xl font-bold" style={{ color }}>{value}</p>
  </div>
)

export default function AlertsCenterPage() {
  const { alerts, setAlertStatus, acknowledgeAll } = useAlertStore()
  const can = useAuthStore((s) => s.can)
  const addNotification = useNotificationStore((s) => s.addNotification)
  const canManage = can(PERMISSIONS.MANAGE_ALERTS)

  const [typeFilter, setTypeFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = alerts.filter((a) => {
    return (
      (typeFilter === 'all' || a.type === typeFilter) &&
      (severityFilter === 'all' || a.severity === severityFilter) &&
      (statusFilter === 'all' || a.status === statusFilter)
    )
  })

  const counts = {
    active: alerts.filter((a) => a.status === 'active').length,
    critical: alerts.filter((a) => a.severity === 'critical' && a.status !== 'resolved').length,
    acknowledged: alerts.filter((a) => a.status === 'acknowledged').length,
    resolved: alerts.filter((a) => a.status === 'resolved').length,
  }

  const handleAcknowledge = (id) => {
    setAlertStatus(id, 'acknowledged')
    addNotification({ type: 'info', message: 'Alert acknowledged' })
  }
  const handleResolve = (id) => {
    setAlertStatus(id, 'resolved')
    addNotification({ type: 'success', message: 'Alert resolved' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
            <Bell className="h-7 w-7 text-blue-600" /> Alerts Center
          </h1>
          <p className="mt-1 text-sm text-gray-500">Speeding, geofence, health, maintenance and document alerts.</p>
        </div>
        {canManage && counts.active > 0 && (
          <button
            onClick={() => { acknowledgeAll(); addNotification({ type: 'info', message: 'All active alerts acknowledged' }) }}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            <CheckCheck className="h-4 w-4" /> Acknowledge all
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active" value={counts.active} color="#dc2626" />
        <StatCard label="Critical" value={counts.critical} color="#ef4444" />
        <StatCard label="Acknowledged" value={counts.acknowledged} color="#f59e0b" />
        <StatCard label="Resolved" value={counts.resolved} color="#10b981" />
      </div>

      <div className="flex flex-wrap gap-3 rounded-lg bg-white p-4 shadow">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
          <option value="all">All Types</option>
          {alertTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
          <option value="all">All Severities</option>
          {alertSeverities.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-lg bg-white p-10 text-center text-gray-500 shadow">No alerts match the current filters.</div>
        )}
        {filtered.map((alert) => {
          const sev = alertSeverities.find((s) => s.value === alert.severity)
          const type = alertTypes.find((t) => t.value === alert.type)
          const Icon = severityIcon[alert.severity] || Info
          const vehicle = mockVehicles.find((v) => v.id === alert.vehicleId)
          return (
            <div
              key={alert.id}
              className={`flex items-start gap-4 rounded-lg bg-white p-4 shadow ${alert.status === 'resolved' ? 'opacity-60' : ''}`}
              style={{ borderLeft: `4px solid ${sev?.color}` }}
            >
              <div className="rounded-lg p-2" style={{ backgroundColor: `${sev?.color}20` }}>
                <Icon className="h-5 w-5" style={{ color: sev?.color }} />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                  <span className="rounded-full px-2 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: type?.color }}>{type?.label}</span>
                  {vehicle && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{vehicle.licensePlate}</span>}
                </div>
                <p className="mt-1 text-sm text-gray-600">{alert.message}</p>
                <p className="mt-1 text-xs text-gray-400">{alert.timestamp}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-600">{alert.status}</span>
                {canManage && alert.status !== 'resolved' && (
                  <div className="flex gap-1">
                    {alert.status === 'active' && (
                      <button onClick={() => handleAcknowledge(alert.id)} title="Acknowledge" className="rounded p-1.5 text-amber-600 hover:bg-amber-50">
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button onClick={() => handleResolve(alert.id)} title="Resolve" className="rounded p-1.5 text-green-600 hover:bg-green-50">
                      <CheckCheck className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
