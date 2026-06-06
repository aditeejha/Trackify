import { create } from 'zustand'
import { hasPermission } from '../auth/roles'
import {
  mockAlerts,
  mockGeofences,
  mockDocuments,
  mockVehicleTelemetry,
} from '../data/operationsData'

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
  // Role/permission helpers used by route guards and pages.
  hasRole: (role) => get().user?.role === role,
  can: (permission) => hasPermission(get().user?.role, permission),
}))

export const useShipmentStore = create((set, get) => ({
  shipments: [],
  selectedShipment: null,
  filters: {
    status: 'all',
    searchQuery: '',
    dateRange: 'all',
  },
  setShipments: (shipments) => set({ shipments }),
  setSelectedShipment: (shipment) => set({ selectedShipment: shipment }),
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  addShipment: (shipment) => set({ shipments: [...get().shipments, shipment] }),
  updateShipment: (id, updates) =>
    set({
      shipments: get().shipments.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }),
}))

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  addNotification: (notification) => {
    const id = Date.now()
    const notif = { ...notification, id }
    set({ notifications: [...get().notifications, notif] })
    setTimeout(() => {
      set({ notifications: get().notifications.filter((n) => n.id !== id) })
    }, notification.duration || 3000)
  },
  removeNotification: (id) =>
    set({ notifications: get().notifications.filter((n) => n.id !== id) }),
}))

// Live tracking telemetry. Positions are mutated by the tracking page's
// simulation loop so multiple views stay in sync.
export const useTrackingStore = create((set, get) => ({
  telemetry: mockVehicleTelemetry,
  selectedVehicleId: mockVehicleTelemetry[0]?.vehicleId || null,
  setSelectedVehicle: (vehicleId) => set({ selectedVehicleId: vehicleId }),
  updateTelemetry: (vehicleId, updates) =>
    set({
      telemetry: get().telemetry.map((t) =>
        t.vehicleId === vehicleId ? { ...t, ...updates } : t
      ),
    }),
}))

export const useGeofenceStore = create((set, get) => ({
  geofences: mockGeofences,
  addGeofence: (geofence) =>
    set({ geofences: [...get().geofences, { id: `G${Date.now()}`, ...geofence }] }),
  updateGeofence: (id, updates) =>
    set({
      geofences: get().geofences.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }),
  removeGeofence: (id) =>
    set({ geofences: get().geofences.filter((g) => g.id !== id) }),
  toggleGeofence: (id) =>
    set({
      geofences: get().geofences.map((g) =>
        g.id === id ? { ...g, active: !g.active } : g
      ),
    }),
}))

export const useAlertStore = create((set, get) => ({
  alerts: mockAlerts,
  addAlert: (alert) =>
    set({
      alerts: [{ id: `A${Date.now()}`, status: 'active', ...alert }, ...get().alerts],
    }),
  setAlertStatus: (id, status) =>
    set({
      alerts: get().alerts.map((a) => (a.id === id ? { ...a, status } : a)),
    }),
  acknowledgeAll: () =>
    set({
      alerts: get().alerts.map((a) =>
        a.status === 'active' ? { ...a, status: 'acknowledged' } : a
      ),
    }),
  activeCount: () => get().alerts.filter((a) => a.status === 'active').length,
}))

export const useDocumentStore = create((set, get) => ({
  documents: mockDocuments,
  addDocument: (doc) =>
    set({ documents: [{ id: `DOC${Date.now()}`, ...doc }, ...get().documents] }),
  removeDocument: (id) =>
    set({ documents: get().documents.filter((d) => d.id !== id) }),
}))
