export const mockShipments = [
  {
    id: '001',
    trackingNumber: 'TRK001',
    sender: { name: 'Alice Johnson', address: '123 Main St, NY' },
    receiver: { name: 'Bob Smith', address: '456 Oak Ave, LA' },
    status: 'in_transit',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-16',
    estimatedDelivery: '2024-01-18',
    locations: [
      { lat: 40.7128, lng: -74.006, timestamp: '2024-01-15 10:00', status: 'picked_up' },
      { lat: 39.7392, lng: -104.9903, timestamp: '2024-01-16 08:00', status: 'in_transit' },
    ],
  },
  {
    id: '002',
    trackingNumber: 'TRK002',
    sender: { name: 'Charlie Brown', address: '789 Pine Rd, TX' },
    receiver: { name: 'Diana Prince', address: '321 Elm St, FL' },
    status: 'delivered',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-14',
    estimatedDelivery: '2024-01-14',
    locations: [
      { lat: 32.7767, lng: -96.797, timestamp: '2024-01-10 09:00', status: 'picked_up' },
      { lat: 28.5383, lng: -81.3792, timestamp: '2024-01-14 15:30', status: 'delivered' },
    ],
  },
  {
    id: '003',
    trackingNumber: 'TRK003',
    sender: { name: 'Eve Wilson', address: '555 Birch Ln, WA' },
    receiver: { name: 'Frank Miller', address: '888 Maple Dr, MI' },
    status: 'pending',
    createdAt: '2024-01-17',
    updatedAt: '2024-01-17',
    estimatedDelivery: '2024-01-20',
    locations: [],
  },
]

export const shipmentStatuses = [
  { value: 'pending', label: 'Pending', color: '#6b7280' },
  { value: 'picked_up', label: 'Picked Up', color: '#3b82f6' },
  { value: 'in_transit', label: 'In Transit', color: '#f59e0b' },
  { value: 'out_for_delivery', label: 'Out for Delivery', color: '#8b5cf6' },
  { value: 'delivered', label: 'Delivered', color: '#10b981' },
  { value: 'cancelled', label: 'Cancelled', color: '#ef4444' },
]
