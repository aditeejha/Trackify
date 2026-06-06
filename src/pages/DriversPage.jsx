import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import { mockDrivers, driverStatuses } from '../data/fleetData'

const DriverRow = ({ driver, onViewClick }) => {
  const status = driverStatuses.find((s) => s.value === driver.status)
  return (
    <tr className="border-b hover:bg-gray-50 cursor-pointer" onClick={onViewClick}>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{driver.name}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{driver.email}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{driver.phone}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{driver.deliveriesCompleted}</td>
      <td className="px-6 py-4 text-sm">
        <span className="px-3 py-1 rounded-full text-white text-xs font-medium" style={{ backgroundColor: status?.color }}>
          {status?.label}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-yellow-600 font-medium">★ {driver.rating.toFixed(1)}</td>
    </tr>
  )
}

export default function DriversPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredDrivers = mockDrivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.phone.includes(searchQuery)
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Drivers</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          New Driver
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">All Status</option>
            {driverStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deliveries</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDrivers.map((driver) => (
              <DriverRow key={driver.id} driver={driver} onViewClick={() => navigate(`/drivers/${driver.id}`)} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
