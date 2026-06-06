import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Header } from './components/Header'
import { Notification } from './components/Notification'
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
import { useAuthStore } from './store'

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" />
}

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
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shipments"
              element={
                <ProtectedRoute>
                  <ShipmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shipments/:id"
              element={
                <ProtectedRoute>
                  <ShipmentDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vehicles"
              element={
                <ProtectedRoute>
                  <VehiclesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vehicles/:id"
              element={
                <ProtectedRoute>
                  <VehicleDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/drivers"
              element={
                <ProtectedRoute>
                  <DriversPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/drivers/:id"
              element={
                <ProtectedRoute>
                  <DriverDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assignments"
              element={
                <ProtectedRoute>
                  <VehicleAssignmentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fuel"
              element={
                <ProtectedRoute>
                  <FuelManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <ExpenseTrackingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/maintenance"
              element={
                <ProtectedRoute>
                  <MaintenanceManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reminders"
              element={
                <ProtectedRoute>
                  <ServiceRemindersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
