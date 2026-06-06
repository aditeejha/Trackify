import React from 'react'
import { Link } from 'react-router-dom'
import { Wrench, AlertTriangle, Heart, Clock, CheckCircle } from 'lucide-react'
import { mockVehicleHealth, healthStatus } from '../../data/operationsData'
import { mockVehicles, mockMaintenanceRecords, mockServiceReminders, maintenanceStatuses, reminderPriorities } from '../../data/fleetData'
import { useAlertStore } from '../../store'

export default function MechanicDashboard() {
  const healthAlerts = useAlertStore((s) => s.alerts.filter((a) => (a.type === 'health' || a.type === 'maintenance') && a.status !== 'resolved'))

  const workQueue = mockMaintenanceRecords.filter((m) => m.status === 'in_progress' || m.status === 'scheduled')
  const completed = mockMaintenanceRecords.filter((m) => m.status === 'completed')
  const dueReminders = mockServiceReminders.filter((r) => r.status === 'active' || r.status === 'overdue')
  const criticalVehicles = mockVehicleHealth.filter((h) => h.overallScore < 50)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mechanic Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Maintenance queue, vehicle diagnostics and service reminders.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between"><p className="text-sm text-gray-600">In Work Queue</p><Wrench className="h-5 w-5 text-amber-500" /></div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{workQueue.length}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between"><p className="text-sm text-gray-600">Critical Health</p><Heart className="h-5 w-5 text-red-500" /></div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{criticalVehicles.length}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between"><p className="text-sm text-gray-600">Due Reminders</p><Clock className="h-5 w-5 text-blue-500" /></div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{dueReminders.length}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between"><p className="text-sm text-gray-600">Completed</p><CheckCircle className="h-5 w-5 text-green-500" /></div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{completed.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900"><Wrench className="h-5 w-5 text-amber-500" /> Work Queue</h2>
            <Link to="/maintenance" className="text-xs text-blue-600 hover:underline">Maintenance</Link>
          </div>
          {workQueue.length === 0 ? <p className="text-sm text-gray-500">No open jobs.</p> : (
            <div className="space-y-3">
              {workQueue.map((m) => {
                const v = mockVehicles.find((mv) => mv.id === m.vehicleId)
                const status = maintenanceStatuses.find((s) => s.value === m.status)
                return (
                  <div key={m.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                    <div>
                      <p className="font-medium text-gray-900">{m.description}</p>
                      <p className="text-xs text-gray-500">{v?.licensePlate} · {m.date}</p>
                    </div>
                    <span className="rounded-full px-3 py-1 text-xs font-medium text-white" style={{ backgroundColor: status?.color }}>{status?.label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900"><Heart className="h-5 w-5 text-red-500" /> Vehicle Health</h2>
          <div className="space-y-3">
            {mockVehicleHealth.map((h) => {
              const v = mockVehicles.find((mv) => mv.id === h.vehicleId)
              const status = healthStatus(h.overallScore)
              return (
                <Link key={h.vehicleId} to="/health" className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{v?.licensePlate}</p>
                    {h.dtc.length > 0 && <p className="flex items-center gap-1 text-xs text-amber-600"><AlertTriangle className="h-3 w-3" /> {h.dtc.length} code(s)</p>}
                  </div>
                  <span className="rounded-full px-3 py-1 text-xs font-medium text-white" style={{ backgroundColor: status.color }}>{h.overallScore} · {status.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900"><Clock className="h-5 w-5 text-blue-500" /> Service Reminders</h2>
          <Link to="/reminders" className="text-xs text-blue-600 hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {dueReminders.map((r) => {
            const v = mockVehicles.find((mv) => mv.id === r.vehicleId)
            const priority = reminderPriorities.find((p) => p.value === r.priority)
            return (
              <div key={r.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                <div>
                  <p className="font-medium text-gray-900">{r.description}</p>
                  <p className="text-xs text-gray-500">{v?.licensePlate} · due {r.dueDate}</p>
                </div>
                <span className="rounded-full px-3 py-1 text-xs font-medium text-white" style={{ backgroundColor: priority?.color }}>{priority?.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
