import React, { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import { mockFuelRecords, mockVehicles } from '../data/fleetData'

const FuelRow = ({ record, onViewClick }) => {
  const vehicle = mockVehicles.find((v) => v.id === record.vehicleId)
  const fuelEfficiency = record.mileage ? (record.quantity / record.mileage * 100).toFixed(2) : 'N/A'

  return (
    <tr className="border-b hover:bg-gray-50 cursor-pointer" onClick={onViewClick}>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{vehicle?.licensePlate}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{record.date}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{record.quantity} L</td>
      <td className="px-6 py-4 text-sm text-gray-600">₹{record.cost.toLocaleString()}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{fuelEfficiency} km/L</td>
      <td className="px-6 py-4 text-sm text-gray-600">{record.location}</td>
    </tr>
  )
}

export default function FuelManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('all')

  const filteredRecords = mockFuelRecords.filter((record) => {
    const vehicle = mockVehicles.find((v) => v.id === record.vehicleId)
    const matchesSearch = vehicle?.licensePlate.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const totalFuelCost = filteredRecords.reduce((sum, record) => sum + record.cost, 0)
  const totalQuantity = filteredRecords.reduce((sum, record) => sum + record.quantity, 0)
  const avgCostPerLiter = totalQuantity > 0 ? (totalFuelCost / totalQuantity).toFixed(2) : 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Fuel Management</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          Add Fuel Record
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Total Fuel Cost</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">₹{totalFuelCost.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Total Quantity</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalQuantity} L</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Avg Cost/Liter</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">₹{avgCostPerLiter}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by vehicle license plate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRecords.map((record) => (
              <FuelRow key={record.id} record={record} onViewClick={() => {}} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
