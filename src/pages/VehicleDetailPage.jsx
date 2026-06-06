import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Truck, Calendar, Gauge } from 'lucide-react'
import { mockVehicles, mockDrivers, vehicleStatuses } from '../data/fleetData'

export default function VehicleDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const vehicle = mockVehicles.find((v) => v.id === id)
  const driver = vehicle?.assignedDriver ? mockDrivers.find((d) => d.id === vehicle.assignedDriver) : null
  const status = vehicleStatuses.find((s) => s.value === vehicle?.status)

  if (!vehicle) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Vehicle not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/vehicles')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Vehicles
      </button>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{vehicle.licensePlate}</h1>
            <p className="text-gray-600 mt-2">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
          </div>
          <span className="px-4 py-2 rounded-full text-white font-medium" style={{ backgroundColor: status?.color }}>
            {status?.label}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">VIN</p>
                <p className="font-medium text-gray-900">{vehicle.vin}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium text-gray-900 capitalize">{vehicle.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Color</p>
                <p className="font-medium text-gray-900">{vehicle.color}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Capacity</p>
                <p className="font-medium text-gray-900">{vehicle.capacity.toLocaleString()} kg</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Operational Details</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Gauge className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Mileage</p>
                  <p className="font-medium text-gray-900">{vehicle.mileage.toLocaleString()} km</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Registration Expiry</p>
                  <p className="font-medium text-gray-900">{vehicle.registrationExpiry}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Maintenance</p>
                <p className="font-medium text-gray-900">{vehicle.maintenanceDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Purchase Date</p>
                <p className="font-medium text-gray-900">{vehicle.purchaseDate}</p>
              </div>
            </div>
          </div>
        </div>

        {driver && (
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Assigned Driver</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{driver.name}</p>
                  <p className="text-sm text-gray-600">{driver.email}</p>
                  <p className="text-sm text-gray-600">{driver.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">License Expiry</p>
                  <p className="font-medium text-gray-900">{driver.licenseExpiry}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
