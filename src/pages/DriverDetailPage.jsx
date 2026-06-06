import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Calendar, Award } from 'lucide-react'
import { mockDrivers, mockVehicles, driverStatuses } from '../data/fleetData'

export default function DriverDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const driver = mockDrivers.find((d) => d.id === id)
  const vehicle = driver?.assignedVehicle ? mockVehicles.find((v) => v.id === driver.assignedVehicle) : null
  const status = driverStatuses.find((s) => s.value === driver?.status)

  if (!driver) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Driver not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/drivers')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Drivers
      </button>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{driver.name}</h1>
            <p className="text-gray-600 mt-2">Driver ID: {driver.id}</p>
          </div>
          <span className="px-4 py-2 rounded-full text-white font-medium" style={{ backgroundColor: status?.color }}>
            {status?.label}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{driver.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{driver.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">License Number</p>
                <p className="font-medium text-gray-900">{driver.licenseNumber}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="font-medium text-gray-900">★ {driver.rating.toFixed(1)} / 5.0</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Deliveries Completed</p>
                <p className="font-medium text-gray-900">{driver.deliveriesCompleted}</p>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Joined</p>
                  <p className="font-medium text-gray-900">{driver.joinDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">License Information</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">License Expiry</p>
                <p className="font-medium text-gray-900">{driver.licenseExpiry}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`font-medium ${new Date(driver.licenseExpiry) > new Date() ? 'text-green-600' : 'text-red-600'}`}>
                  {new Date(driver.licenseExpiry) > new Date() ? 'Valid' : 'Expired'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {vehicle && (
          <div className="border-t pt-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Assigned Vehicle</h2>
            <div className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100" onClick={() => navigate(`/vehicles/${vehicle.id}`)}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{vehicle.licensePlate}</p>
                  <p className="text-sm text-gray-600">{vehicle.make} {vehicle.model}</p>
                </div>
                <p className="text-sm text-blue-600">View Vehicle →</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
