import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar'
import RoleGate from './components/RoleGate'
import AdminPage from './pages/AdminPage'
import AdminCamerasPage from './pages/AdminCamerasPage'
import AdminNotesPage from './pages/AdminNotesPage'
import AiPage from './pages/AiPage'
import EmployeeDashboard from './pages/EmployeeDashboard'
import LoginPage from './pages/LoginPage'
import NetworkPage from './pages/NetworkPage'
import SignupPage from './pages/SignupPage'
import StoragePage from './pages/StoragePage'

function App() {
  const location = useLocation()
  const isAuthScreen = location.pathname === '/login' || location.pathname === '/signup'

  return (
    <>
      <NavBar />
      <div
        key={location.pathname}
        className={`route-transition ${isAuthScreen ? 'no-sidebar-layout' : ''}`}
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              <RoleGate>
                <EmployeeDashboard />
              </RoleGate>
            }
          />
          <Route
            path="/admin"
            element={
              <RoleGate>
                <AdminPage />
              </RoleGate>
            }
          />
          <Route
            path="/admin/cameras"
            element={
              <RoleGate>
                <AdminCamerasPage />
              </RoleGate>
            }
          />
          <Route
            path="/admin/notes"
            element={
              <RoleGate>
                <AdminNotesPage />
              </RoleGate>
            }
          />
          <Route
            path="/network"
            element={
              <RoleGate>
                <NetworkPage />
              </RoleGate>
            }
          />
          <Route
            path="/storage"
            element={
              <RoleGate>
                <StoragePage />
              </RoleGate>
            }
          />
          <Route
            path="/ai"
            element={
              <RoleGate>
                <AiPage />
              </RoleGate>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </>
  )
}

export default App
