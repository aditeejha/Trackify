// Mock data powering the operational features: live tracking telemetry,
// geofences, alerts, documents, vehicle health, and user accounts.
import { ROLES } from '../auth/roles'

// ---------------------------------------------------------------------------
// Users (for the Admin user-management view)
// ---------------------------------------------------------------------------
export const mockUsers = [
  { id: 'U001', name: 'Sarah Chen', email: 'admin@trackify.com', role: ROLES.ADMIN, status: 'active', lastActive: '2026-06-07', phone: '+1-555-0001' },
  { id: 'U002', name: 'Marcus Reed', email: 'manager@trackify.com', role: ROLES.FLEET_MANAGER, status: 'active', lastActive: '2026-06-07', phone: '+1-555-0002' },
  { id: 'D001', name: 'John Smith', email: 'driver@trackify.com', role: ROLES.DRIVER, status: 'active', lastActive: '2026-06-06', phone: '+1-555-0101' },
  { id: 'U004', name: 'Diego Alvarez', email: 'mechanic@trackify.com', role: ROLES.MECHANIC, status: 'active', lastActive: '2026-06-07', phone: '+1-555-0004' },
  { id: 'D002', name: 'Maria Garcia', email: 'maria.garcia@trackify.com', role: ROLES.DRIVER, status: 'active', lastActive: '2026-06-05', phone: '+1-555-0102' },
  { id: 'U006', name: 'Priya Patel', email: 'priya.patel@trackify.com', role: ROLES.FLEET_MANAGER, status: 'inactive', lastActive: '2026-05-20', phone: '+1-555-0006' },
]

// ---------------------------------------------------------------------------
// Live tracking telemetry. Positions use a normalized 0-100 coordinate space
// so the bundled SVG map renders without any external map provider/token.
// `route` is a list of waypoints the marker is animated along.
// ---------------------------------------------------------------------------
export const mockVehicleTelemetry = [
  {
    vehicleId: 'V001',
    driverId: 'D001',
    status: 'moving',
    speed: 64,
    heading: 78,
    fuelLevel: 72,
    engineTemp: 91,
    odometer: 45120,
    lastUpdate: '2026-06-07 10:42',
    location: 'I-80 near Sacramento, CA',
    position: { x: 22, y: 38 },
    route: [
      { x: 12, y: 30 },
      { x: 22, y: 38 },
      { x: 38, y: 42 },
      { x: 55, y: 50 },
      { x: 72, y: 58 },
    ],
  },
  {
    vehicleId: 'V002',
    driverId: 'D002',
    status: 'moving',
    speed: 41,
    heading: 145,
    fuelLevel: 48,
    engineTemp: 88,
    odometer: 78240,
    lastUpdate: '2026-06-07 10:42',
    location: 'Downtown LA, CA',
    position: { x: 64, y: 70 },
    route: [
      { x: 80, y: 84 },
      { x: 72, y: 78 },
      { x: 64, y: 70 },
      { x: 56, y: 62 },
      { x: 48, y: 55 },
    ],
  },
  {
    vehicleId: 'V003',
    driverId: null,
    status: 'idle',
    speed: 0,
    heading: 0,
    fuelLevel: 90,
    engineTemp: 40,
    odometer: 125000,
    lastUpdate: '2026-06-07 09:15',
    location: 'Central Depot, Oakland, CA',
    position: { x: 15, y: 80 },
    route: [{ x: 15, y: 80 }],
  },
]

// ---------------------------------------------------------------------------
// Geofences (circular zones in the same 0-100 coordinate space)
// ---------------------------------------------------------------------------
export const mockGeofences = [
  {
    id: 'G001',
    name: 'Central Depot',
    type: 'depot',
    center: { x: 15, y: 80 },
    radius: 12,
    active: true,
    alertOnEnter: true,
    alertOnExit: true,
    description: 'Main vehicle depot and loading yard',
  },
  {
    id: 'G002',
    name: 'LA Distribution Hub',
    type: 'hub',
    center: { x: 64, y: 72 },
    radius: 10,
    active: true,
    alertOnEnter: true,
    alertOnExit: false,
    description: 'Southern California distribution center',
  },
  {
    id: 'G003',
    name: 'Restricted Zone — Downtown Core',
    type: 'restricted',
    center: { x: 48, y: 48 },
    radius: 8,
    active: true,
    alertOnEnter: true,
    alertOnExit: false,
    description: 'No heavy vehicles permitted during peak hours',
  },
]

export const geofenceTypes = [
  { value: 'depot', label: 'Depot', color: '#2563eb' },
  { value: 'hub', label: 'Distribution Hub', color: '#10b981' },
  { value: 'restricted', label: 'Restricted Zone', color: '#ef4444' },
  { value: 'customer', label: 'Customer Site', color: '#8b5cf6' },
]

// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------
export const alertTypes = [
  { value: 'speeding', label: 'Speeding', color: '#ef4444' },
  { value: 'geofence', label: 'Geofence', color: '#8b5cf6' },
  { value: 'maintenance', label: 'Maintenance', color: '#f59e0b' },
  { value: 'health', label: 'Vehicle Health', color: '#ef4444' },
  { value: 'document', label: 'Document Expiry', color: '#3b82f6' },
  { value: 'fuel', label: 'Fuel', color: '#10b981' },
]

export const alertSeverities = [
  { value: 'critical', label: 'Critical', color: '#dc2626' },
  { value: 'warning', label: 'Warning', color: '#f59e0b' },
  { value: 'info', label: 'Info', color: '#3b82f6' },
]

export const mockAlerts = [
  { id: 'A001', type: 'speeding', severity: 'warning', vehicleId: 'V001', title: 'Speed limit exceeded', message: 'V001 (ABC123) recorded 84 mph in a 65 mph zone on I-80.', timestamp: '2026-06-07 10:30', status: 'active' },
  { id: 'A002', type: 'geofence', severity: 'critical', vehicleId: 'V002', title: 'Entered restricted zone', message: 'V002 (XYZ789) entered "Restricted Zone — Downtown Core" during peak hours.', timestamp: '2026-06-07 09:58', status: 'active' },
  { id: 'A003', type: 'health', severity: 'critical', vehicleId: 'V003', title: 'Brake wear critical', message: 'V003 (DEF456) brake pads at 12% — service required immediately.', timestamp: '2026-06-07 08:20', status: 'active' },
  { id: 'A004', type: 'document', severity: 'warning', vehicleId: 'V002', title: 'Insurance expiring soon', message: 'Insurance for V002 (XYZ789) expires in 14 days.', timestamp: '2026-06-06 14:00', status: 'active' },
  { id: 'A005', type: 'maintenance', severity: 'warning', vehicleId: 'V003', title: 'Service overdue', message: 'Major service for V003 (DEF456) is overdue by 8 days.', timestamp: '2026-06-06 11:45', status: 'acknowledged' },
  { id: 'A006', type: 'fuel', severity: 'info', vehicleId: 'V002', title: 'Low fuel', message: 'V002 (XYZ789) fuel level dropped below 50%.', timestamp: '2026-06-05 16:10', status: 'resolved' },
]

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------
export const documentTypes = [
  { value: 'registration', label: 'Registration', color: '#2563eb' },
  { value: 'insurance', label: 'Insurance', color: '#8b5cf6' },
  { value: 'license', label: 'Driver License', color: '#10b981' },
  { value: 'inspection', label: 'Inspection Certificate', color: '#f59e0b' },
  { value: 'permit', label: 'Operating Permit', color: '#06b6d4' },
]

export const mockDocuments = [
  { id: 'DOC001', name: 'Vehicle Registration — ABC123', type: 'registration', entityType: 'vehicle', entityId: 'V001', issueDate: '2022-03-15', expiryDate: '2026-03-15', fileSize: '240 KB', uploadedBy: 'Marcus Reed' },
  { id: 'DOC002', name: 'Insurance Policy — ABC123', type: 'insurance', entityType: 'vehicle', entityId: 'V001', issueDate: '2025-07-01', expiryDate: '2026-07-01', fileSize: '512 KB', uploadedBy: 'Marcus Reed' },
  { id: 'DOC003', name: 'Insurance Policy — XYZ789', type: 'insurance', entityType: 'vehicle', entityId: 'V002', issueDate: '2025-06-21', expiryDate: '2026-06-21', fileSize: '498 KB', uploadedBy: 'Marcus Reed' },
  { id: 'DOC004', name: 'Driver License — John Smith', type: 'license', entityType: 'driver', entityId: 'D001', issueDate: '2020-08-15', expiryDate: '2026-08-15', fileSize: '180 KB', uploadedBy: 'Sarah Chen' },
  { id: 'DOC005', name: 'Annual Inspection — DEF456', type: 'inspection', entityType: 'vehicle', entityId: 'V003', issueDate: '2025-02-20', expiryDate: '2026-02-20', fileSize: '320 KB', uploadedBy: 'Diego Alvarez' },
  { id: 'DOC006', name: 'Operating Permit — Fleet', type: 'permit', entityType: 'vehicle', entityId: 'V001', issueDate: '2025-01-01', expiryDate: '2027-01-01', fileSize: '210 KB', uploadedBy: 'Sarah Chen' },
]

// ---------------------------------------------------------------------------
// Vehicle health monitoring. Each component has a health % (0-100).
// `dtc` are diagnostic trouble codes read from the vehicle.
// ---------------------------------------------------------------------------
export const healthComponents = [
  { key: 'engine', label: 'Engine' },
  { key: 'brakes', label: 'Brakes' },
  { key: 'tires', label: 'Tires' },
  { key: 'battery', label: 'Battery' },
  { key: 'oil', label: 'Oil Life' },
  { key: 'transmission', label: 'Transmission' },
]

export const mockVehicleHealth = [
  {
    vehicleId: 'V001',
    overallScore: 88,
    lastDiagnostic: '2026-06-07 06:00',
    components: { engine: 92, brakes: 80, tires: 85, battery: 95, oil: 70, transmission: 96 },
    dtc: [],
  },
  {
    vehicleId: 'V002',
    overallScore: 74,
    lastDiagnostic: '2026-06-07 06:00',
    components: { engine: 85, brakes: 68, tires: 60, battery: 78, oil: 55, transmission: 90 },
    dtc: [{ code: 'P0420', description: 'Catalyst system efficiency below threshold', severity: 'warning' }],
  },
  {
    vehicleId: 'V003',
    overallScore: 41,
    lastDiagnostic: '2026-06-07 06:00',
    components: { engine: 60, brakes: 12, tires: 45, battery: 50, oil: 30, transmission: 55 },
    dtc: [
      { code: 'C1234', description: 'Brake pad wear sensor — front axle', severity: 'critical' },
      { code: 'P0300', description: 'Random/multiple cylinder misfire detected', severity: 'warning' },
    ],
  },
]

// Maps a health % to a status label + color used across health views.
export function healthStatus(score) {
  if (score >= 80) return { label: 'Good', color: '#10b981' }
  if (score >= 60) return { label: 'Fair', color: '#f59e0b' }
  if (score >= 40) return { label: 'Poor', color: '#f97316' }
  return { label: 'Critical', color: '#ef4444' }
}

// Days until a date string (negative = past). Used for document/expiry status.
export function daysUntil(dateStr, today = '2026-06-07') {
  const ms = new Date(dateStr).getTime() - new Date(today).getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
}
