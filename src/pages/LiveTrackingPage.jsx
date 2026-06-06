import React, { useEffect, useRef, useState } from 'react'
import { Navigation, Gauge, Fuel, Thermometer, MapPin, Radio, Pause, Play } from 'lucide-react'
import { FleetMap } from '../components/FleetMap'
import { useTrackingStore, useGeofenceStore } from '../store'
import { mockVehicles } from '../data/fleetData'

// Advances a position one step toward the next waypoint, looping the route.
function stepAlongRoute(pos, route, segIndexRef) {
  if (!route || route.length < 2) return { pos, speedJitter: 0 }
  let target = route[segIndexRef.current % route.length]
  const dx = target.x - pos.x
  const dy = target.y - pos.y
  const dist = Math.hypot(dx, dy)
  const stepSize = 0.6
  if (dist < stepSize) {
    segIndexRef.current = (segIndexRef.current + 1) % route.length
    return { pos: target, speedJitter: 0 }
  }
  return {
    pos: { x: pos.x + (dx / dist) * stepSize, y: pos.y + (dy / dist) * stepSize },
    speedJitter: Math.round((Math.sin(segIndexRef.current + dist) * 6)),
  }
}

const Metric = ({ icon: Icon, label, value, unit, color }) => (
  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
    <div className="rounded-lg p-2" style={{ backgroundColor: `${color}20` }}>
      <Icon className="h-5 w-5" style={{ color }} />
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-900">
        {value}
        {unit && <span className="ml-1 text-sm font-normal text-gray-500">{unit}</span>}
      </p>
    </div>
  </div>
)

export default function LiveTrackingPage() {
  const { telemetry, selectedVehicleId, setSelectedVehicle, updateTelemetry } = useTrackingStore()
  const geofences = useGeofenceStore((s) => s.geofences)
  const [live, setLive] = useState(true)
  // Per-vehicle route segment cursors persisted across ticks.
  const segIndexes = useRef({})

  useEffect(() => {
    if (!live) return
    const interval = setInterval(() => {
      telemetry.forEach((t) => {
        if (t.status !== 'moving') return
        if (!segIndexes.current[t.vehicleId]) segIndexes.current[t.vehicleId] = 0
        const ref = { current: segIndexes.current[t.vehicleId] }
        const { pos, speedJitter } = stepAlongRoute(t.position, t.route, ref)
        segIndexes.current[t.vehicleId] = ref.current
        updateTelemetry(t.vehicleId, {
          position: pos,
          speed: Math.max(0, t.speed + speedJitter - 2 + Math.round(Math.abs(speedJitter))),
        })
      })
    }, 1200)
    return () => clearInterval(interval)
  }, [live, telemetry, updateTelemetry])

  const selected = telemetry.find((t) => t.vehicleId === selectedVehicleId)
  const selectedVehicle = mockVehicles.find((v) => v.id === selectedVehicleId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Vehicle Tracking</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <Radio className={`h-4 w-4 ${live ? 'text-green-500' : 'text-gray-400'}`} />
            {live ? 'Live — positions updating in real time' : 'Paused'}
          </p>
        </div>
        <button
          onClick={() => setLive((v) => !v)}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          {live ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {live ? 'Pause' : 'Resume'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-white p-4 shadow">
            <FleetMap
              vehicles={telemetry}
              geofences={geofences}
              selectedVehicleId={selectedVehicleId}
              onSelectVehicle={setSelectedVehicle}
              height={500}
            />
          </div>
        </div>

        {/* Vehicle list + detail */}
        <div className="space-y-4">
          <div className="rounded-lg bg-white p-4 shadow">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Fleet ({telemetry.length})</h2>
            <div className="space-y-2">
              {telemetry.map((t) => {
                const v = mockVehicles.find((mv) => mv.id === t.vehicleId)
                const active = t.vehicleId === selectedVehicleId
                return (
                  <button
                    key={t.vehicleId}
                    onClick={() => setSelectedVehicle(t.vehicleId)}
                    className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors ${active ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <div>
                      <p className="font-medium text-gray-900">{v?.licensePlate || t.vehicleId}</p>
                      <p className="text-xs text-gray-500">{t.location}</p>
                    </div>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-medium capitalize text-white"
                      style={{ backgroundColor: t.status === 'moving' ? '#10b981' : t.status === 'idle' ? '#f59e0b' : '#6b7280' }}
                    >
                      {t.status}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {selected && (
            <div className="rounded-lg bg-white p-4 shadow">
              <h2 className="mb-1 text-lg font-semibold text-gray-900">
                {selectedVehicle?.licensePlate || selected.vehicleId}
              </h2>
              <p className="mb-4 flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-4 w-4" /> {selected.location}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Metric icon={Gauge} label="Speed" value={selected.speed} unit="mph" color="#2563eb" />
                <Metric icon={Navigation} label="Heading" value={`${selected.heading}°`} color="#8b5cf6" />
                <Metric icon={Fuel} label="Fuel" value={selected.fuelLevel} unit="%" color="#10b981" />
                <Metric icon={Thermometer} label="Engine" value={selected.engineTemp} unit="°C" color="#f59e0b" />
              </div>
              <p className="mt-4 text-xs text-gray-400">Last update: {selected.lastUpdate}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
