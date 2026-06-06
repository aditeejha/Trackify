import React, { useState } from 'react'
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts'
import { Activity, AlertTriangle, Wrench, Heart } from 'lucide-react'
import { mockVehicleHealth, healthComponents, healthStatus } from '../data/operationsData'
import { mockVehicles } from '../data/fleetData'

const ScoreGauge = ({ score }) => {
  const status = healthStatus(score)
  const data = [{ name: 'score', value: score, fill: status.color }]
  return (
    <div className="relative h-40 w-40">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar background dataKey="value" cornerRadius={20} angleAxisId={0} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900">{score}</span>
        <span className="text-xs font-medium" style={{ color: status.color }}>{status.label}</span>
      </div>
    </div>
  )
}

const ComponentBar = ({ label, value }) => {
  const status = healthStatus(value)
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-gray-700">{label}</span>
        <span className="font-medium" style={{ color: status.color }}>{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: status.color }} />
      </div>
    </div>
  )
}

export default function VehicleHealthPage() {
  const [selectedId, setSelectedId] = useState(mockVehicleHealth[0]?.vehicleId)
  const health = mockVehicleHealth.find((h) => h.vehicleId === selectedId)
  const vehicle = mockVehicles.find((v) => v.id === selectedId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
          <Heart className="h-7 w-7 text-red-500" /> Vehicle Health Monitoring
        </h1>
        <p className="mt-1 text-sm text-gray-500">Real-time component diagnostics and trouble codes for each vehicle.</p>
      </div>

      {/* Fleet health overview cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {mockVehicleHealth.map((h) => {
          const v = mockVehicles.find((mv) => mv.id === h.vehicleId)
          const status = healthStatus(h.overallScore)
          const active = h.vehicleId === selectedId
          return (
            <button
              key={h.vehicleId}
              onClick={() => setSelectedId(h.vehicleId)}
              className={`rounded-lg bg-white p-5 text-left shadow transition-all ${active ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{v?.licensePlate || h.vehicleId}</p>
                  <p className="text-xs text-gray-500">{v?.make} {v?.model}</p>
                </div>
                <span className="rounded-full px-3 py-1 text-xs font-medium text-white" style={{ backgroundColor: status.color }}>
                  {status.label}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Activity className="h-4 w-4 text-gray-400" />
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full" style={{ width: `${h.overallScore}%`, backgroundColor: status.color }} />
                </div>
                <span className="text-sm font-semibold text-gray-700">{h.overallScore}</span>
              </div>
              {h.dtc.length > 0 && (
                <p className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                  <AlertTriangle className="h-3 w-3" /> {h.dtc.length} trouble code(s)
                </p>
              )}
            </button>
          )
        })}
      </div>

      {health && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Gauge + meta */}
          <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">{vehicle?.licensePlate}</h2>
            <p className="mb-4 text-sm text-gray-500">Overall Health Score</p>
            <ScoreGauge score={health.overallScore} />
            <p className="mt-4 text-xs text-gray-400">Last diagnostic: {health.lastDiagnostic}</p>
          </div>

          {/* Component breakdown */}
          <div className="rounded-lg bg-white p-6 shadow lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Component Health</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {healthComponents.map((c) => (
                <ComponentBar key={c.key} label={c.label} value={health.components[c.key] ?? 0} />
              ))}
            </div>

            <h2 className="mb-3 mt-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Wrench className="h-5 w-5 text-gray-500" /> Diagnostic Trouble Codes
            </h2>
            {health.dtc.length === 0 ? (
              <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">No active trouble codes — all systems nominal.</p>
            ) : (
              <div className="space-y-2">
                {health.dtc.map((code) => (
                  <div key={code.code} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                    <div>
                      <p className="font-mono text-sm font-semibold text-gray-900">{code.code}</p>
                      <p className="text-sm text-gray-600">{code.description}</p>
                    </div>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                      style={{ backgroundColor: code.severity === 'critical' ? '#ef4444' : '#f59e0b' }}
                    >
                      {code.severity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
