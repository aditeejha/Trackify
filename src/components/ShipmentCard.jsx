import React from 'react'
import { format } from 'date-fns'
import { MapPin, Calendar, Truck, CheckCircle } from 'lucide-react'
import { shipmentStatuses } from '../data/mockData'

export function ShipmentCard({ shipment, onClick }) {
  const statusInfo = shipmentStatuses.find((s) => s.value === shipment.status)
  const Icon = shipment.status === 'delivered' ? CheckCircle : Truck

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 cursor-pointer border-l-4"
      style={{ borderLeftColor: statusInfo?.color }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{shipment.trackingNumber}</h3>
          <p className="text-sm text-gray-500">{shipment.sender.name}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100">
          <Icon className="w-4 h-4" style={{ color: statusInfo?.color }} />
          <span className="text-sm font-medium text-gray-700">{statusInfo?.label}</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{shipment.receiver.address}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Est. Delivery: {format(new Date(shipment.estimatedDelivery), 'MMM dd, yyyy')}</span>
        </div>
      </div>

      <div className="pt-4 border-t text-xs text-gray-500">
        Last updated: {format(new Date(shipment.updatedAt), 'MMM dd, yyyy HH:mm')}
      </div>
    </div>
  )
}
