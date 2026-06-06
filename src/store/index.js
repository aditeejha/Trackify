import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
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
