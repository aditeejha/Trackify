import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, User, Calendar, Package } from 'lucide-react'
import { format } from 'date-fns'
import { TrackingTimeline } from '../components/TrackingTimeline'
import { mockShipments, shipmentStatuses } from '../data/mockData'

export default function ShipmentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const shipment = mockShipments.find((s) => s.id === id)
  const statusInfo = shipmentStatuses.find((s) => s.value === shipment?.status)

  if (!shipment) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Shipment not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/shipments')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Shipments
      </button>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{shipment.trackingNumber}</h1>
            <p className="text-gray-600 mt-2">Tracking ID: {shipment.id}</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: statusInfo?.color }}
            ></div>
            <span className="text-sm font-medium text-gray-700">{statusInfo?.label}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sender</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{shipment.sender.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium text-gray-900">{shipment.sender.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Receiver</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{shipment.receiver.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium text-gray-900">{shipment.receiver.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b">
          <div>
            <p className="text-sm text-gray-600">Created Date</p>
            <p className="font-medium text-gray-900">{format(new Date(shipment.createdAt), 'MMM dd, yyyy')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Est. Delivery</p>
            <p className="font-medium text-gray-900">{format(new Date(shipment.estimatedDelivery), 'MMM dd, yyyy')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="font-medium text-gray-900">{format(new Date(shipment.updatedAt), 'MMM dd, yyyy HH:mm')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-medium text-gray-900">{statusInfo?.label}</p>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-6">Tracking Timeline</h2>
        {shipment.locations.length > 0 ? (
          <TrackingTimeline locations={shipment.locations} />
        ) : (
          <p className="text-gray-500">No tracking updates yet</p>
        )}
      </div>
    </div>
  )
}
