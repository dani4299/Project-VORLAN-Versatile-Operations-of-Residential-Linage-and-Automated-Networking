import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROLES, setRole } from '../utils/auth'

const ACCOUNTS_KEY = 'vorlan_accounts'

function loadAccounts() {
  const stored = localStorage.getItem(ACCOUNTS_KEY)
  if (stored) return JSON.parse(stored)
  
  // Failsafe default accounts just in case local storage gets wiped
  const seed = [
    { id: 1, username: 'admin', password: '123', role: ROLES.ADMIN, approved: true, name: 'Default Admin' },
    { id: 2, username: 'employee', password: '123', role: ROLES.EMPLOYEE, approved: true, name: 'Default Employee' },
  ]
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(seed))
  return seed
}

function LoginPage() {
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setSelectedRole] = useState(ROLES.EMPLOYEE)
  const [error, setError] = useState('')

  useEffect(() => {
    setAccounts(loadAccounts())
  }, [])

  const handleLogin = (event) => {
    event.preventDefault()
    setError('')

    // Check if the user exists with the EXACT username, password, and role
    const match = accounts.find(
      (acc) =>
        acc.username === username &&
        acc.password === password &&
        acc.role === role
    )

    if (!match) {
      setError('Invalid username, password, or role mismatch.')
      return
    }

    if (match.approved === false) {
      setError('Your account is pending admin approval.')
      return
    }

    // Auth successful, let them in
    setRole(role)
    localStorage.setItem('isAuthenticated', 'true')
    
    if (role === ROLES.ADMIN) navigate('/admin')
    else if (role === ROLES.EMPLOYEE) navigate('/dashboard')
  }

  return (
    <main className="page login-page">
      <div className="abstract-art">
        <span className="blob one" />
        <span className="blob two" />
        <span className="blob three" />
      </div>
      
      <section className="login-card">
        <h1>VORLAN Portal</h1>
        <p className="subtle">Sign in to continue.</p>

        <form className="login-simple" onSubmit={handleLogin}>
          <label className="field-label">
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., admin"
            />
          </label>
          <label className="field-label">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>
          <label className="field-label">
            Role
            <select value={role} onChange={(e) => setSelectedRole(e.target.value)}>
              <option value={ROLES.EMPLOYEE}>Employee</option>
              <option value={ROLES.ADMIN}>Admin</option>
            </select>
          </label>
          
          {error && <p className="error-text">{error}</p>}
          
          <button type="submit" className="primary-btn wide-btn" style={{ marginTop: '8px' }}>
            Continue
          </button>
          
          <p className="muted small-text" style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link to="/signup" className="link-inline">
              Create a new account
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}

export default LoginPage