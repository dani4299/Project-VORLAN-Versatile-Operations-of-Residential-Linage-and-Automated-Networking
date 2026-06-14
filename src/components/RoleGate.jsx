import { Navigate, useLocation } from 'react-router-dom'
import { canAccess, getRole } from '../utils/auth'

function RoleGate({ children }) {
  const location = useLocation()
  const role = getRole()

  if (!canAccess(location.pathname, role)) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default RoleGate
