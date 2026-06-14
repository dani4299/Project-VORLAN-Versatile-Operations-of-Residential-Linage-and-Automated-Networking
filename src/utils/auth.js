const ROLE_KEY = 'vorlan_role'

export const ROLES = {
  GUEST: 'guest',
  EMPLOYEE: 'employee',
  ADMIN: 'admin',
}

export function getRole() {
  return localStorage.getItem(ROLE_KEY) || ROLES.GUEST
}

export function setRole(role) {
  localStorage.setItem(ROLE_KEY, role)
}

export function clearRole() {
  localStorage.removeItem(ROLE_KEY)
}

export function canAccess(pathname, role) {
  if (pathname === '/login' || pathname === '/signup') return true
  if (role === ROLES.ADMIN) return true
  if (role === ROLES.EMPLOYEE) {
    return ['/dashboard', '/network', '/storage', '/ai'].includes(pathname)
  }
  return false
}
