import React, { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Package, Truck, CheckCircle } from 'lucide-react'
import { mockShipments } from '../data/mockData'

const chartData = [
  { name: 'Jan', delivered: 120, pending: 30 },
  { name: 'Feb', delivered: 150, pending: 25 },
  { name: 'Mar', delivered: 140, pending: 35 },
  { name: 'Apr', delivered: 180, pending: 20 },
]

const statusData = [
  { name: 'Delivered', value: 65 },
  { name: 'In Transit', value: 20 },
  { name: 'Pending', value: 15 },
]

const COLORS = ['#10b981', '#f59e0b', '#6b7280']

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-lg`} style={{ backgroundColor: `${color}20` }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
    </div>
  </div>
)

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalShipments: 0,
    activeShipments: 0,
    delivered: 0,
    avgDeliveryTime: 0,
  })

  useEffect(() => {
    const delivered = mockShipments.filter((s) => s.status === 'delivered').length
    const active = mockShipments.filter((s) => s.status !== 'delivered' && s.status !== 'cancelled').length

    setStats({
      totalShipments: mockShipments.length,
      activeShipments: active,
      delivered,
      avgDeliveryTime: 2.5,
    })
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Package} label="Total Shipments" value={stats.totalShipments} color="#2563eb" />
        <StatCard icon={Truck} label="Active Shipments" value={stats.activeShipments} color="#f59e0b" />
        <StatCard icon={CheckCircle} label="Delivered" value={stats.delivered} color="#10b981" />
        <StatCard icon={TrendingUp} label="Avg Delivery Days" value={stats.avgDeliveryTime} color="#8b5cf6" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipments Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="delivered" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="delivered" fill="#10b981" />
            <Bar dataKey="pending" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
