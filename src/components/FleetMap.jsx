import React from 'react'
import { geofenceTypes } from '../data/operationsData'

// A lightweight, dependency-free map rendered as SVG. Coordinates are in a
// normalized 0-100 space so we don't need an external map provider or token.
// Renders optional geofence circles and vehicle markers.
export function FleetMap({
  vehicles = [],
  geofences = [],
  selectedVehicleId = null,
  onSelectVehicle,
  height = 460,
}) {
  const statusColor = (status) =>
    status === 'moving' ? '#10b981' : status === 'idle' ? '#f59e0b' : '#6b7280'

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-white/10"
      style={{
        height,
        background:
          'radial-gradient(700px circle at 30% 10%, rgba(37,99,235,0.18), transparent 55%), #070a12',
      }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {/* grid */}
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="0.15" />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="rgba(255,255,255,0.05)" strokeWidth="0.15" />
        ))}
        {/* stylized "roads" */}
        <path d="M0,32 L40,40 L70,60 L100,70" fill="none" stroke="rgba(96,165,250,0.55)" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M15,80 L48,48 L82,84" fill="none" stroke="rgba(96,165,250,0.55)" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M20,5 L48,48 L60,95" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.1" strokeLinecap="round" />

        {/* geofences */}
        {geofences.map((g) => {
          const type = geofenceTypes.find((t) => t.value === g.type)
          const color = type?.color || '#2563eb'
          return (
            <g key={g.id} opacity={g.active ? 1 : 0.3}>
              <circle cx={g.center.x} cy={g.center.y} r={g.radius} fill={color} fillOpacity="0.12" stroke={color} strokeWidth="0.4" strokeDasharray="1.2 0.8" />
              <text x={g.center.x} y={g.center.y - g.radius - 1} fontSize="2.4" textAnchor="middle" fill={color} fontWeight="600">
                {g.name}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Vehicle markers as absolutely-positioned HTML for crisp text + clicks */}
      {vehicles.map((v) => {
        const pos = v.position || { x: 50, y: 50 }
        const selected = v.vehicleId === selectedVehicleId
        return (
          <button
            key={v.vehicleId}
            onClick={() => onSelectVehicle && onSelectVehicle(v.vehicleId)}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, zIndex: selected ? 20 : 10 }}
            title={`${v.vehicleId} — ${v.location || ''}`}
          >
            <span
              className={`flex items-center justify-center rounded-full text-[10px] font-bold text-white shadow-md ${selected ? 'ring-4 ring-blue-300' : ''}`}
              style={{
                width: selected ? 30 : 24,
                height: selected ? 30 : 24,
                backgroundColor: statusColor(v.status),
              }}
            >
              {v.vehicleId?.replace('V', '')}
            </span>
            {selected && (
              <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-0.5 text-[10px] text-white shadow">
                {v.speed} mph
              </span>
            )}
          </button>
        )
      })}

      {/* Legend */}
      <div className="absolute bottom-2 right-2 rounded-lg border border-white/10 bg-ink-900/80 px-3 py-2 text-xs backdrop-blur">
        <div className="mb-1 font-semibold text-gray-700">Status</div>
        {[
          ['Moving', '#10b981'],
          ['Idle', '#f59e0b'],
          ['Offline', '#6b7280'],
        ].map(([label, color]) => (
          <div key={label} className="flex items-center gap-2 text-gray-600">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
