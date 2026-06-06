import React from 'react'
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'
import { useNotificationStore } from '../store'

export function Notification() {
  const notifications = useNotificationStore((state) => state.notifications)

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />
      case 'error':
        return <XCircle className="w-5 h-5" />
      case 'warning':
        return <AlertCircle className="w-5 h-5" />
      default:
        return <Info className="w-5 h-5" />
    }
  }

  const getStyles = (type) => {
    const baseStyles = 'p-4 rounded-lg shadow-lg flex items-center gap-3'
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 text-green-800 border border-green-200`
      case 'error':
        return `${baseStyles} bg-red-50 text-red-800 border border-red-200`
      case 'warning':
        return `${baseStyles} bg-yellow-50 text-yellow-800 border border-yellow-200`
      default:
        return `${baseStyles} bg-blue-50 text-blue-800 border border-blue-200`
    }
  }

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {notifications.map((notification) => (
        <div key={notification.id} className={getStyles(notification.type)}>
          {getIcon(notification.type)}
          <span>{notification.message}</span>
        </div>
      ))}
    </div>
  )
}
