import React, { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import { mockMaintenanceRecords, mockVehicles, maintenanceTypes, maintenanceStatuses } from '../data/fleetData'

const MaintenanceRow = ({ record, onViewClick }) => {
  const vehicle = mockVehicles.find((v) => v.id === record.vehicleId)
  const type = maintenanceTypes.find((t) => t.value === record.type)
  const status = maintenanceStatuses.find((s) => s.value === record.status)

  return (
    <tr className="border-b hover:bg-gray-50 cursor-pointer" onClick={onViewClick}>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{vehicle?.licensePlate}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{record.date}</td>
      <td className="px-6 py-4 text-sm">
        <span className="px-3 py-1 rounded-full text-white text-xs font-medium" style={{ backgroundColor: type?.color }}>
          {type?.label}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">{record.description}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{record.mileage.toLocaleString()} km</td>
      <td className="px-6 py-4 text-sm font-medium">₹{record.cost.toLocaleString()}</td>
      <td className="px-6 py-4 text-sm">
        <span className="px-3 py-1 rounded-full text-white text-xs font-medium" style={{ backgroundColor: status?.color }}>
          {status?.label}
        </span>
      </td>
    </tr>
  )
}

export default function MaintenanceManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredRecords = mockMaintenanceRecords.filter((record) => {
    const vehicle = mockVehicles.find((v) => v.id === record.vehicleId)
    const matchesSearch =
      vehicle?.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || record.type === typeFilter
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const totalCost = filteredRecords.reduce((sum, record) => sum + record.cost, 0)
  const completedCount = filteredRecords.filter((r) => r.status === 'completed').length
  const inProgressCount = filteredRecords.filter((r) => r.status === 'in_progress').length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Maintenance Management</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          New Maintenance
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Total Cost</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">₹{totalCost.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Completed</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{completedCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">In Progress</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{inProgressCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by vehicle, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">All Types</option>
            {maintenanceTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">All Status</option>
            {maintenanceStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mileage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRecords.map((record) => (
              <MaintenanceRow key={record.id} record={record} onViewClick={() => {}} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
