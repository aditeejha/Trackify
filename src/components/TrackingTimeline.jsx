import React from 'react'
import { format } from 'date-fns'
import { CheckCircle, Truck, AlertCircle } from 'lucide-react'

export function TrackingTimeline({ locations }) {
  const getIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-600" />
      case 'out_for_delivery':
        return <AlertCircle className="w-6 h-6 text-orange-600" />
      default:
        return <Truck className="w-6 h-6 text-blue-600" />
    }
  }

  return (
    <div className="space-y-8">
      {locations.map((location, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            {getIcon(location.status)}
            {index < locations.length - 1 && (
              <div className="w-1 h-16 bg-gray-200 my-2"></div>
            )}
          </div>
          <div className="pt-1">
            <p className="font-semibold text-gray-900 capitalize">
              {location.status.replace(/_/g, ' ')}
            </p>
            <p className="text-sm text-gray-600">
              {format(new Date(location.timestamp), 'MMM dd, yyyy HH:mm')}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
