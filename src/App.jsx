import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Header } from './components/Header'
import { Notification } from './components/Notification'
import { RoleRoute } from './components/RoleRoute'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ShipmentsPage from './pages/ShipmentsPage'
import ShipmentDetailPage from './pages/ShipmentDetailPage'
import ReportsPage from './pages/ReportsPage'
import VehiclesPage from './pages/VehiclesPage'
import VehicleDetailPage from './pages/VehicleDetailPage'
import DriversPage from './pages/DriversPage'
import DriverDetailPage from './pages/DriverDetailPage'
import VehicleAssignmentPage from './pages/VehicleAssignmentPage'
import FuelManagementPage from './pages/FuelManagementPage'
import ExpenseTrackingPage from './pages/ExpenseTrackingPage'
import MaintenanceManagementPage from './pages/MaintenanceManagementPage'
import ServiceRemindersPage from './pages/ServiceRemindersPage'
import LiveTrackingPage from './pages/LiveTrackingPage'
import GeofencingPage from './pages/GeofencingPage'
import AlertsCenterPage from './pages/AlertsCenterPage'
import DocumentManagementPage from './pages/DocumentManagementPage'
import VehicleHealthPage from './pages/VehicleHealthPage'
import AdminDashboard from './pages/dashboards/AdminDashboard'
import FleetManagerDashboard from './pages/dashboards/FleetManagerDashboard'
import DriverDashboard from './pages/dashboards/DriverDashboard'
import MechanicDashboard from './pages/dashboards/MechanicDashboard'
import { useAuthStore } from './store'
import { PERMISSIONS, roleHomeRoute } from './auth/roles'

// Sends an authenticated user to the dashboard that matches their role.
function HomeRedirect() {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Navigate to={roleHomeRoute[user?.role] || '/fleet'} replace />
}

const guarded = (permission, element) => <RoleRoute permission={permission}>{element}</RoleRoute>

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && <Header />}
        <Notification />
        <main className={isAuthenticated ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Role dashboards */}
            <Route path="/admin" element={guarded(PERMISSIONS.MANAGE_USERS, <AdminDashboard />)} />
            <Route path="/fleet" element={guarded(PERMISSIONS.VIEW_DASHBOARD, <FleetManagerDashboard />)} />
            <Route path="/driver" element={guarded(PERMISSIONS.VIEW_DASHBOARD, <DriverDashboard />)} />
            <Route path="/mechanic" element={guarded(PERMISSIONS.VIEW_DASHBOARD, <MechanicDashboard />)} />
            <Route path="/dashboard" element={guarded(PERMISSIONS.VIEW_DASHBOARD, <DashboardPage />)} />

            {/* New operational features */}
            <Route path="/tracking" element={guarded(PERMISSIONS.VIEW_TRACKING, <LiveTrackingPage />)} />
            <Route path="/geofencing" element={guarded(PERMISSIONS.MANAGE_GEOFENCES, <GeofencingPage />)} />
            <Route path="/alerts" element={guarded(PERMISSIONS.VIEW_ALERTS, <AlertsCenterPage />)} />
            <Route path="/documents" element={guarded(PERMISSIONS.VIEW_DOCUMENTS, <DocumentManagementPage />)} />
            <Route path="/health" element={guarded(PERMISSIONS.VIEW_HEALTH, <VehicleHealthPage />)} />

            {/* Existing pages */}
            <Route path="/shipments" element={guarded(PERMISSIONS.VIEW_SHIPMENTS, <ShipmentsPage />)} />
            <Route path="/shipments/:id" element={guarded(PERMISSIONS.VIEW_SHIPMENTS, <ShipmentDetailPage />)} />
            <Route path="/vehicles" element={guarded(PERMISSIONS.VIEW_VEHICLES, <VehiclesPage />)} />
            <Route path="/vehicles/:id" element={guarded(PERMISSIONS.VIEW_VEHICLES, <VehicleDetailPage />)} />
            <Route path="/drivers" element={guarded(PERMISSIONS.MANAGE_DRIVERS, <DriversPage />)} />
            <Route path="/drivers/:id" element={guarded(PERMISSIONS.MANAGE_DRIVERS, <DriverDetailPage />)} />
            <Route path="/assignments" element={guarded(PERMISSIONS.MANAGE_ASSIGNMENTS, <VehicleAssignmentPage />)} />
            <Route path="/fuel" element={guarded(PERMISSIONS.MANAGE_FINANCE, <FuelManagementPage />)} />
            <Route path="/expenses" element={guarded(PERMISSIONS.MANAGE_FINANCE, <ExpenseTrackingPage />)} />
            <Route path="/maintenance" element={guarded(PERMISSIONS.MANAGE_MAINTENANCE, <MaintenanceManagementPage />)} />
            <Route path="/reminders" element={guarded(PERMISSIONS.MANAGE_MAINTENANCE, <ServiceRemindersPage />)} />
            <Route path="/reports" element={guarded(PERMISSIONS.VIEW_REPORTS, <ReportsPage />)} />

            <Route path="/" element={<HomeRedirect />} />
            <Route path="*" element={<HomeRedirect />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
