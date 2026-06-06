import React, { useState } from 'react'
import { FileText, Plus, Trash2, Download, X, Upload } from 'lucide-react'
import { useDocumentStore, useAuthStore, useNotificationStore } from '../store'
import { documentTypes, daysUntil } from '../data/operationsData'
import { PERMISSIONS } from '../auth/roles'
import { mockVehicles, mockDrivers } from '../data/fleetData'

// Expiry status derived from days remaining.
function expiryStatus(expiryDate) {
  const d = daysUntil(expiryDate)
  if (d < 0) return { label: 'Expired', color: '#ef4444', days: d }
  if (d <= 30) return { label: `Expires in ${d}d`, color: '#f59e0b', days: d }
  return { label: 'Valid', color: '#10b981', days: d }
}

function entityName(doc) {
  if (doc.entityType === 'driver') return mockDrivers.find((d) => d.id === doc.entityId)?.name || doc.entityId
  return mockVehicles.find((v) => v.id === doc.entityId)?.licensePlate || doc.entityId
}

export default function DocumentManagementPage() {
  const { documents, addDocument, removeDocument } = useDocumentStore()
  const can = useAuthStore((s) => s.can)
  const addNotification = useNotificationStore((s) => s.addNotification)
  const canManage = can(PERMISSIONS.MANAGE_DOCUMENTS)

  const [typeFilter, setTypeFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'registration', entityType: 'vehicle', entityId: 'V001', issueDate: '', expiryDate: '' })

  const filtered = documents.filter((d) => typeFilter === 'all' || d.type === typeFilter)
  const expiringSoon = documents.filter((d) => { const x = daysUntil(d.expiryDate); return x >= 0 && x <= 30 }).length
  const expired = documents.filter((d) => daysUntil(d.expiryDate) < 0).length

  const handleSubmit = (e) => {
    e.preventDefault()
    addDocument({ ...form, fileSize: '256 KB', uploadedBy: useAuthStore.getState().user?.name || 'Unknown' })
    addNotification({ type: 'success', message: `Document "${form.name}" uploaded` })
    setShowForm(false)
    setForm({ name: '', type: 'registration', entityType: 'vehicle', entityId: 'V001', issueDate: '', expiryDate: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
            <FileText className="h-7 w-7 text-blue-600" /> Document Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">Registrations, insurance, licenses, inspections and permits with expiry tracking.</p>
        </div>
        {canManage && (
          <button onClick={() => setShowForm((v) => !v)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <Plus className="h-5 w-5" /> Upload Document
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow"><p className="text-sm text-gray-500">Total Documents</p><p className="mt-1 text-2xl font-bold text-gray-900">{documents.length}</p></div>
        <div className="rounded-lg bg-white p-4 shadow"><p className="text-sm text-gray-500">Expiring ≤ 30 days</p><p className="mt-1 text-2xl font-bold text-amber-500">{expiringSoon}</p></div>
        <div className="rounded-lg bg-white p-4 shadow"><p className="text-sm text-gray-500">Expired</p><p className="mt-1 text-2xl font-bold text-red-500">{expired}</p></div>
      </div>

      {showForm && canManage && (
        <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Upload Document</h2>
            <button type="button" onClick={() => setShowForm(false)}><X className="h-5 w-5 text-gray-400" /></button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Document name" required className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
              {documentTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select value={form.entityType} onChange={(e) => setForm({ ...form, entityType: e.target.value, entityId: e.target.value === 'driver' ? 'D001' : 'V001' })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option value="vehicle">Vehicle</option>
              <option value="driver">Driver</option>
            </select>
            <select value={form.entityId} onChange={(e) => setForm({ ...form, entityId: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
              {(form.entityType === 'driver' ? mockDrivers : mockVehicles).map((x) => (
                <option key={x.id} value={x.id}>{x.name || x.licensePlate}</option>
              ))}
            </select>
            <label className="text-xs text-gray-500">Issue date<input type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" /></label>
            <label className="text-xs text-gray-500">Expiry date<input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" /></label>
          </div>
          <button type="submit" className="mt-4 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            <Upload className="h-4 w-4" /> Upload
          </button>
        </form>
      )}

      <div className="rounded-lg bg-white p-4 shadow">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
          <option value="all">All Types</option>
          {documentTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Document', 'Type', 'Linked To', 'Expiry', 'Status', ''].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filtered.map((doc) => {
              const type = documentTypes.find((t) => t.value === doc.type)
              const status = expiryStatus(doc.expiryDate)
              return (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-400">{doc.fileSize} · by {doc.uploadedBy}</p>
                  </td>
                  <td className="px-6 py-4"><span className="rounded-full px-2 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: type?.color }}>{type?.label}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-600">{entityName(doc)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doc.expiryDate}</td>
                  <td className="px-6 py-4"><span className="rounded-full px-2 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: status.color }}>{status.label}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => addNotification({ type: 'info', message: 'Download started (demo)' })} title="Download" className="rounded p-1.5 text-blue-600 hover:bg-blue-50"><Download className="h-4 w-4" /></button>
                      {canManage && (
                        <button onClick={() => { removeDocument(doc.id); addNotification({ type: 'success', message: 'Document removed' }) }} title="Delete" className="rounded p-1.5 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
