import React, { useMemo, useState } from 'react'
import { Plus, Trash2, MapPin, Power, X } from 'lucide-react'
import { FleetMap } from '../components/FleetMap'
import { useGeofenceStore, useTrackingStore, useNotificationStore } from '../store'
import { geofenceTypes } from '../data/operationsData'
import { mockVehicles } from '../data/fleetData'

// Euclidean distance in the normalized map space.
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

export default function GeofencingPage() {
  const { geofences, addGeofence, removeGeofence, toggleGeofence } = useGeofenceStore()
  const telemetry = useTrackingStore((s) => s.telemetry)
  const addNotification = useNotificationStore((s) => s.addNotification)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'depot', x: 50, y: 50, radius: 10 })

  // Which vehicles currently fall inside each active geofence.
  const occupancy = useMemo(() => {
    const map = {}
    geofences.forEach((g) => {
      map[g.id] = telemetry
        .filter((t) => g.active && dist(t.position, g.center) <= g.radius)
        .map((t) => t.vehicleId)
    })
    return map
  }, [geofences, telemetry])

  const handleSubmit = (e) => {
    e.preventDefault()
    addGeofence({
      name: form.name || 'New Zone',
      type: form.type,
      center: { x: Number(form.x), y: Number(form.y) },
      radius: Number(form.radius),
      active: true,
      alertOnEnter: true,
      alertOnExit: false,
      description: 'User-defined geofence',
    })
    addNotification({ type: 'success', message: `Geofence "${form.name}" created` })
    setShowForm(false)
    setForm({ name: '', type: 'depot', x: 50, y: 50, radius: 10 })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Geofencing</h1>
          <p className="mt-1 text-sm text-gray-500">Define zones and monitor which vehicles enter or leave them.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" /> New Geofence
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg bg-white p-4 shadow">
          <FleetMap vehicles={telemetry} geofences={geofences} height={460} />
        </div>

        <div className="space-y-4">
          {showForm && (
            <form onSubmit={handleSubmit} className="rounded-lg bg-white p-4 shadow">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">New Geofence</h2>
                <button type="button" onClick={() => setShowForm(false)}>
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Zone name"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {geofenceTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <div className="grid grid-cols-3 gap-2">
                  {['x', 'y', 'radius'].map((field) => (
                    <label key={field} className="text-xs text-gray-500">
                      {field === 'radius' ? 'Radius' : `Center ${field.toUpperCase()}`}
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={form[field]}
                        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </label>
                  ))}
                </div>
                <button type="submit" className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Create Geofence
                </button>
              </div>
            </form>
          )}

          <div className="rounded-lg bg-white p-4 shadow">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Zones ({geofences.length})
            </h2>
            <div className="space-y-3">
              {geofences.map((g) => {
                const type = geofenceTypes.find((t) => t.value === g.type)
                const inside = occupancy[g.id] || []
                return (
                  <div key={g.id} className="rounded-lg border border-gray-200 p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: type?.color }} />
                        <div>
                          <p className="font-medium text-gray-900">{g.name}</p>
                          <p className="text-xs text-gray-500">{type?.label}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => toggleGeofence(g.id)}
                          title={g.active ? 'Deactivate' : 'Activate'}
                          className={`rounded p-1.5 ${g.active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                        >
                          <Power className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeGeofence(g.id)}
                          title="Delete"
                          className="rounded p-1.5 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {inside.length > 0
                        ? `${inside.length} vehicle(s) inside: ${inside
                            .map((id) => mockVehicles.find((v) => v.id === id)?.licensePlate || id)
                            .join(', ')}`
                        : 'No vehicles inside'}
                    </div>
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
