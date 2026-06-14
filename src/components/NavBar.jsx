import { Bot, Camera, LayoutDashboard, Network, NotebookText, ShieldCheck, HardDrive } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clearRole, getRole } from '../utils/auth'

const linksByRole = {
  guest: [],
  employee: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/network', label: 'Network', icon: Network },
    { to: '/storage', label: 'Storage', icon: HardDrive },
    { to: '/ai', label: 'AI Chat', icon: Bot },
  ],
  admin: [
    { to: '/admin', label: 'Admin', icon: ShieldCheck },
    { to: '/admin/cameras', label: 'Cameras', icon: Camera },
    { to: '/admin/notes', label: 'Notes', icon: NotebookText },
    { to: '/network', label: 'Network', icon: Network },
    { to: '/storage', label: 'Storage', icon: HardDrive },
    { to: '/ai', label: 'AI Chat', icon: Bot },
  ],
}

function NavBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const role = getRole()
  const navItems = linksByRole[role] ?? []

  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null
  }

  return (
    <aside className={`side-nav ${role === 'admin' ? 'admin-theme' : ''}`}>
      <div className="brand">VORLAN Portal</div>
      <nav>
        {navItems.map((item) => (
          <Link key={item.to} to={item.to} className={location.pathname === item.to ? 'active-link' : ''}>
            <item.icon size={16} />
            {item.label}
          </Link>
        ))}
      </nav>
      <button
        className="ghost-btn side-logout-btn"
        onClick={() => {
          clearRole()
          navigate('/login')
        }}
      >
        Logout
      </button>
    </aside>
  )
}

export default NavBar
