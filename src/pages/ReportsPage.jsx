import React from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Download } from 'lucide-react'

const performanceData = [
  { month: 'Jan', onTime: 95, delayed: 5, cancelled: 0 },
  { month: 'Feb', onTime: 92, delayed: 6, cancelled: 2 },
  { month: 'Mar', onTime: 98, delayed: 2, cancelled: 0 },
  { month: 'Apr', onTime: 94, delayed: 4, cancelled: 2 },
  { month: 'May', onTime: 97, delayed: 2, cancelled: 1 },
]

const regionData = [
  { region: 'North', shipments: 245, delivered: 240, efficiency: 98 },
  { region: 'South', shipments: 198, delivered: 185, efficiency: 93 },
  { region: 'East', shipments: 321, delivered: 315, efficiency: 98 },
  { region: 'West', shipments: 276, delivered: 268, efficiency: 97 },
]

const ReportCard = ({ title, value, unit }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <p className="text-gray-600 text-sm font-medium">{title}</p>
    <p className="text-3xl font-bold text-gray-900 mt-2">
      {value}
      <span className="text-lg text-gray-600 ml-2">{unit}</span>
    </p>
  </div>
)

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard title="Total Shipments" value="1,040" unit="units" />
        <ReportCard title="On-Time Delivery" value="95.2" unit="%" />
        <ReportCard title="Avg Delivery Time" value="2.3" unit="days" />
        <ReportCard title="Customer Satisfaction" value="4.8" unit="/5" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">On-Time Delivery Rate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="onTime" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="delayed" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="onTime" fill="#10b981" />
              <Bar dataKey="delayed" fill="#f59e0b" />
              <Bar dataKey="cancelled" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Performance Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Regional Performance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipments</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {regionData.map((row) => (
                <tr key={row.region}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.region}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.shipments}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.delivered}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                      {row.efficiency}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
