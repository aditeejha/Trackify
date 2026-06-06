import React, { useState } from 'react'
import { Plus, Edit2 } from 'lucide-react'
import { mockVehicles, mockDrivers } from '../data/fleetData'

const AssignmentCard = ({ assignment, onEdit }) => {
  const vehicle = mockVehicles.find((v) => v.id === assignment.vehicleId)
  const driver = mockDrivers.find((d) => d.id === assignment.driverId)

  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{vehicle?.licensePlate}</h3>
          <p className="text-sm text-gray-600">{vehicle?.make} {vehicle?.model}</p>
        </div>
        <button
          onClick={() => onEdit(assignment)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Edit2 className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      <div className="border-t pt-4">
        <p className="text-sm text-gray-600">Assigned to</p>
        <p className="font-medium text-gray-900">{driver?.name}</p>
        <p className="text-sm text-gray-600">{driver?.email}</p>
      </div>
      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500">Assigned: {assignment.assignedDate}</p>
      </div>
    </div>
  )
}

export default function VehicleAssignmentPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [assignments, setAssignments] = useState([
    { vehicleId: 'V001', driverId: 'D001', assignedDate: '2024-01-10' },
    { vehicleId: 'V002', driverId: 'D002', assignedDate: '2024-01-12' },
  ])
  const [formData, setFormData] = useState({ vehicleId: '', driverId: '' })

  const unassignedVehicles = mockVehicles.filter((v) => !assignments.some((a) => a.vehicleId === v.id))
  const unassignedDrivers = mockDrivers.filter((d) => d.status === 'active' && !assignments.some((a) => a.driverId === d.id))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.vehicleId && formData.driverId) {
      if (editingAssignment) {
        setAssignments(assignments.map((a) => (a.vehicleId === editingAssignment.vehicleId ? { ...a, driverId: formData.driverId } : a)))
      } else {
        setAssignments([...assignments, { vehicleId: formData.vehicleId, driverId: formData.driverId, assignedDate: new Date().toISOString().split('T')[0] }])
      }
      setFormData({ vehicleId: '', driverId: '' })
      setEditingAssignment(null)
      setShowForm(false)
    }
  }

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment)
    setFormData({ vehicleId: assignment.vehicleId, driverId: assignment.driverId })
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Vehicle Assignments</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingAssignment(null)
            setFormData({ vehicleId: '', driverId: '' })
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Assignment
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{editingAssignment ? 'Edit Assignment' : 'Create Assignment'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle</label>
              <select
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={!!editingAssignment}
              >
                <option value="">Select a vehicle</option>
                {(editingAssignment ? mockVehicles : unassignedVehicles).map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.licensePlate} - {vehicle.make} {vehicle.model}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Driver</label>
              <select
                value={formData.driverId}
                onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Select a driver</option>
                {unassignedDrivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingAssignment(null)
                  setFormData({ vehicleId: '', driverId: '' })
                }}
                className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <AssignmentCard key={`${assignment.vehicleId}-${assignment.driverId}`} assignment={assignment} onEdit={handleEdit} />
        ))}
      </div>

      {assignments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No assignments yet. Create one to get started.</p>
        </div>
      )}
    </div>
  )
}
