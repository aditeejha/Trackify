import React, { useState } from 'react'
import { Search, Plus, Filter } from 'lucide-react'
import { mockExpenses, mockVehicles, expenseCategories } from '../data/fleetData'

const ExpenseRow = ({ expense, onViewClick }) => {
  const vehicle = mockVehicles.find((v) => v.id === expense.vehicleId)
  const category = expenseCategories.find((c) => c.value === expense.category)
  const statusColor = expense.status === 'paid' ? '#10b981' : '#f59e0b'

  return (
    <tr className="border-b hover:bg-gray-50 cursor-pointer" onClick={onViewClick}>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{expense.date}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{vehicle?.licensePlate}</td>
      <td className="px-6 py-4 text-sm">
        <span className="px-3 py-1 rounded-full text-white text-xs font-medium" style={{ backgroundColor: category?.color }}>
          {category?.label}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{expense.description}</td>
      <td className="px-6 py-4 text-sm font-medium">₹{expense.amount.toLocaleString()}</td>
      <td className="px-6 py-4 text-sm">
        <span className="px-3 py-1 rounded-full text-white text-xs font-medium" style={{ backgroundColor: statusColor }}>
          {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
        </span>
      </td>
    </tr>
  )
}

export default function ExpenseTrackingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredExpenses = mockExpenses.filter((expense) => {
    const vehicle = mockVehicles.find((v) => v.id === expense.vehicleId)
    const matchesSearch =
      vehicle?.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const paidExpenses = filteredExpenses.filter((exp) => exp.status === 'paid').reduce((sum, exp) => sum + exp.amount, 0)
  const pendingExpenses = filteredExpenses.filter((exp) => exp.status === 'pending').reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Expense Tracking</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Total Expenses</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">₹{totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Paid</p>
          <p className="text-3xl font-bold text-green-600 mt-2">₹{paidExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Pending</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">₹{pendingExpenses.toLocaleString()}</p>
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
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">All Categories</option>
            {expenseCategories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredExpenses.map((expense) => (
              <ExpenseRow key={expense.id} expense={expense} onViewClick={() => {}} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
