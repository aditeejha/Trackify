import React from 'react'
import { AlertCircle, Clock, CheckCircle } from 'lucide-react'
import { mockServiceReminders, mockVehicles, reminderPriorities } from '../data/fleetData'

const ReminderCard = ({ reminder }) => {
  const vehicle = mockVehicles.find((v) => v.id === reminder.vehicleId)
  const priority = reminderPriorities.find((p) => p.value === reminder.priority)
  const daysUntilDue = Math.ceil((new Date(reminder.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
  const isOverdue = daysUntilDue < 0
  const isDueSoon = daysUntilDue <= 7 && daysUntilDue >= 0

  const getIcon = () => {
    if (isOverdue) return <AlertCircle className="w-5 h-5" />
    if (isDueSoon) return <Clock className="w-5 h-5" />
    return <CheckCircle className="w-5 h-5" />
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderLeftColor: priority?.color }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getIcon()}
          <div>
            <h3 className="font-semibold text-gray-900">{vehicle?.licensePlate}</h3>
            <p className="text-sm text-gray-600">{reminder.description}</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-white text-xs font-medium" style={{ backgroundColor: priority?.color }}>
          {priority?.label}
        </span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Due Date:</span>
          <span className="font-medium text-gray-900">{reminder.dueDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Days Until Due:</span>
          <span className={`font-medium ${isOverdue ? 'text-red-600' : isDueSoon ? 'text-yellow-600' : 'text-green-600'}`}>
            {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Last Service:</span>
          <span className="font-medium text-gray-900">{reminder.lastServiceDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Service Interval:</span>
          <span className="font-medium text-gray-900">{reminder.interval} km</span>
        </div>
      </div>
    </div>
  )
}

export default function ServiceRemindersPage() {
  const overdueReminders = mockServiceReminders.filter((r) => r.status === 'overdue')
  const activeReminders = mockServiceReminders.filter((r) => r.status === 'active')

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Service Reminders</h1>

      {/* Alert Summary */}
      {overdueReminders.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Overdue Services</h3>
              <p className="text-sm text-red-800">{overdueReminders.length} maintenance reminders are overdue. Please schedule service immediately.</p>
            </div>
          </div>
        </div>
      )}

      {/* Overdue Reminders */}
      {overdueReminders.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Overdue Reminders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {overdueReminders.map((reminder) => (
              <ReminderCard key={reminder.id} reminder={reminder} />
            ))}
          </div>
        </div>
      )}

      {/* Active Reminders */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Reminders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeReminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))}
        </div>
      </div>
    </div>
  )
}
