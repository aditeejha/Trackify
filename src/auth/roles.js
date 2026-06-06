// Role-based access control configuration for Trackify.
// Roles, the permissions each grants, and which navigation/routes they can reach.

export const ROLES = {
  ADMIN: 'admin',
  FLEET_MANAGER: 'fleet_manager',
  DRIVER: 'driver',
  MECHANIC: 'mechanic',
}

export const roleLabels = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.FLEET_MANAGER]: 'Fleet Manager',
  [ROLES.DRIVER]: 'Driver',
  [ROLES.MECHANIC]: 'Mechanic',
}

export const roleColors = {
  [ROLES.ADMIN]: '#8b5cf6',
  [ROLES.FLEET_MANAGER]: '#2563eb',
  [ROLES.DRIVER]: '#10b981',
  [ROLES.MECHANIC]: '#f59e0b',
}

// Granular permissions. Pages check these via the auth store's `can()` helper.
export const PERMISSIONS = {
  VIEW_DASHBOARD: 'view_dashboard',
  MANAGE_USERS: 'manage_users',
  MANAGE_VEHICLES: 'manage_vehicles',
  VIEW_VEHICLES: 'view_vehicles',
  MANAGE_DRIVERS: 'manage_drivers',
  MANAGE_ASSIGNMENTS: 'manage_assignments',
  VIEW_SHIPMENTS: 'view_shipments',
  VIEW_TRACKING: 'view_tracking',
  MANAGE_GEOFENCES: 'manage_geofences',
  VIEW_ALERTS: 'view_alerts',
  MANAGE_ALERTS: 'manage_alerts',
  MANAGE_DOCUMENTS: 'manage_documents',
  VIEW_DOCUMENTS: 'view_documents',
  VIEW_HEALTH: 'view_health',
  MANAGE_MAINTENANCE: 'manage_maintenance',
  VIEW_REPORTS: 'view_reports',
  MANAGE_FINANCE: 'manage_finance',
}

const ALL_PERMISSIONS = Object.values(PERMISSIONS)

// Permission grants per role.
export const rolePermissions = {
  [ROLES.ADMIN]: ALL_PERMISSIONS,
  [ROLES.FLEET_MANAGER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_VEHICLES,
    PERMISSIONS.VIEW_VEHICLES,
    PERMISSIONS.MANAGE_DRIVERS,
    PERMISSIONS.MANAGE_ASSIGNMENTS,
    PERMISSIONS.VIEW_SHIPMENTS,
    PERMISSIONS.VIEW_TRACKING,
    PERMISSIONS.MANAGE_GEOFENCES,
    PERMISSIONS.VIEW_ALERTS,
    PERMISSIONS.MANAGE_ALERTS,
    PERMISSIONS.MANAGE_DOCUMENTS,
    PERMISSIONS.VIEW_DOCUMENTS,
    PERMISSIONS.VIEW_HEALTH,
    PERMISSIONS.MANAGE_MAINTENANCE,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_FINANCE,
  ],
  [ROLES.DRIVER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_VEHICLES,
    PERMISSIONS.VIEW_SHIPMENTS,
    PERMISSIONS.VIEW_TRACKING,
    PERMISSIONS.VIEW_ALERTS,
    PERMISSIONS.VIEW_DOCUMENTS,
    PERMISSIONS.VIEW_HEALTH,
  ],
  [ROLES.MECHANIC]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_VEHICLES,
    PERMISSIONS.VIEW_ALERTS,
    PERMISSIONS.MANAGE_ALERTS,
    PERMISSIONS.VIEW_HEALTH,
    PERMISSIONS.MANAGE_MAINTENANCE,
    PERMISSIONS.VIEW_DOCUMENTS,
  ],
}

export function hasPermission(role, permission) {
  if (!role) return false
  return (rolePermissions[role] || []).includes(permission)
}

// Where each role lands after login.
export const roleHomeRoute = {
  [ROLES.ADMIN]: '/admin',
  [ROLES.FLEET_MANAGER]: '/fleet',
  [ROLES.DRIVER]: '/driver',
  [ROLES.MECHANIC]: '/mechanic',
}

// Demo accounts — one per role — used by the login screen quick-select.
export const demoUsers = [
  {
    id: 'U001',
    name: 'Sarah Chen',
    email: 'admin@trackify.com',
    password: 'demo123',
    role: ROLES.ADMIN,
  },
  {
    id: 'U002',
    name: 'Marcus Reed',
    email: 'manager@trackify.com',
    password: 'demo123',
    role: ROLES.FLEET_MANAGER,
  },
  {
    id: 'D001',
    name: 'John Smith',
    email: 'driver@trackify.com',
    password: 'demo123',
    role: ROLES.DRIVER,
    driverId: 'D001',
  },
  {
    id: 'U004',
    name: 'Diego Alvarez',
    email: 'mechanic@trackify.com',
    password: 'demo123',
    role: ROLES.MECHANIC,
  },
]
