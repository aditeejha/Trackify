import React from 'react'
import { Link } from 'react-router-dom'
import { Truck, MapPin, Bell, Star, Package, Gauge, Fuel, FileText } from 'lucide-react'
import { useAuthStore, useAlertStore, useTrackingStore } from '../../store'
import { mockVehicles, mockDrivers } from '../../data/fleetData'
import { mockDocuments, daysUntil } from '../../data/operationsData'

export default function DriverDashboard() {
  const user = useAuthStore((s) => s.user)
  const driver = mockDrivers.find((d) => d.id === (user?.driverId || 'D001')) || mockDrivers[0]
  const vehicle = mockVehicles.find((v) => v.id === driver.assignedVehicle)
  const telemetry = useTrackingStore((s) => s.telemetry.find((t) => t.vehicleId === driver.assignedVehicle))
  const myAlerts = useAlertStore((s) => s.alerts.filter((a) => a.vehicleId === driver.assignedVehicle && a.status === 'active'))
  const myDocs = mockDocuments.filter((d) => (d.entityType === 'driver' && d.entityId === driver.id) || (d.entityType === 'vehicle' && d.entityId === driver.assignedVehicle))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {driver.name.split(' ')[0]}</h1>
        <p className="mt-1 text-sm text-gray-500">Your assigned vehicle, route status and personal alerts.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between"><p className="text-sm text-gray-600">Deliveries</p><Package className="h-5 w-5 text-blue-500" /></div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{driver.deliveriesCompleted}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between"><p className="text-sm text-gray-600">Rating</p><Star className="h-5 w-5 text-amber-400" /></div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{driver.rating}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between"><p className="text-sm text-gray-600">Active Alerts</p><Bell className="h-5 w-5 text-red-500" /></div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{myAlerts.length}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between"><p className="text-sm text-gray-600">Status</p><MapPin className="h-5 w-5 text-green-500" /></div>
          <p className="mt-2 text-xl font-bold capitalize text-gray-900">{telemetry?.status || 'idle'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900"><Truck className="h-5 w-5 text-blue-600" /> My Vehicle</h2>
          {vehicle ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{vehicle.licensePlate}</p>
                  <p className="text-sm text-gray-500">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
                </div>
                <Link to={`/vehicles/${vehicle.id}`} className="text-sm text-blue-600 hover:underline">Details</Link>
              </div>
              {telemetry && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-gray-50 p-3 text-center"><Gauge className="mx-auto h-5 w-5 text-blue-500" /><p className="mt-1 text-lg font-bold text-gray-900">{telemetry.speed}</p><p className="text-xs text-gray-500">mph</p></div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center"><Fuel className="mx-auto h-5 w-5 text-green-500" /><p className="mt-1 text-lg font-bold text-gray-900">{telemetry.fuelLevel}%</p><p className="text-xs text-gray-500">fuel</p></div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center"><MapPin className="mx-auto h-5 w-5 text-purple-500" /><p className="mt-1 text-sm font-medium text-gray-900">{telemetry.location.split(',')[0]}</p><p className="text-xs text-gray-500">location</p></div>
                </div>
              )}
              <Link to="/tracking" className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">View on live map</Link>
            </>
          ) : (
            <p className="text-sm text-gray-500">No vehicle currently assigned.</p>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900"><Bell className="h-5 w-5 text-red-500" /> My Alerts</h2>
            {myAlerts.length === 0 ? <p className="text-sm text-gray-500">No active alerts. Drive safe!</p> : (
              <div className="space-y-2">
                {myAlerts.map((a) => (
                  <div key={a.id} className="rounded-lg border-l-4 bg-gray-50 p-3" style={{ borderColor: a.severity === 'critical' ? '#ef4444' : '#f59e0b' }}>
                    <p className="text-sm font-medium text-gray-800">{a.title}</p>
                    <p className="text-xs text-gray-500">{a.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900"><FileText className="h-5 w-5 text-blue-500" /> My Documents</h2>
            <div className="space-y-2">
              {myDocs.map((d) => {
                const days = daysUntil(d.expiryDate)
                return (
                  <div key={d.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 text-sm">
                    <span className="text-gray-800">{d.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${days < 0 ? 'bg-red-100 text-red-700' : days <= 30 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                      {days < 0 ? 'Expired' : `${days}d`}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
