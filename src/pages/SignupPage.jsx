import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROLES } from '../utils/auth'

const ACCOUNTS_KEY = 'vorlan_accounts'

function SignupPage() {
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(ROLES.EMPLOYEE)
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem(ACCOUNTS_KEY)
    setAccounts(stored ? JSON.parse(stored) : [])
  }, [])

  const onSignup = (event) => {
    event.preventDefault()
    setError('')
    
    if (!name || !username || !password) {
      setError('Bro, fill out the required fields.')
      return
    }
    
    if (accounts.some((acc) => acc.username === username)) {
      setError('Username already exists. Pick another one.')
      return
    }

    const next = {
      id: Date.now(),
      name,
      email: email || `${username}@vorlan.local`,
      username,
      password,
      role,
      approved: true, // FIXED: Auto-approve so you don't lock yourself out during the demo
    }
    
    const updated = [...accounts, next]
    setAccounts(updated)
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updated))
    
    alert("Account created successfully! You can now log in.")
    navigate('/login')
  }

  return (
    <main className="page login-page">
      <div className="abstract-art">
        <span className="blob one" />
        <span className="blob two" />
        <span className="blob three" />
      </div>
      <section className="login-card">
        <h1>Create account</h1>
        <p className="subtle">Register as an employee or admin.</p>
        <form className="login-simple" onSubmit={onSignup}>
          <label className="field-label">
            Full name
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="field-label">
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="field-label">
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label className="field-label">
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <label className="field-label">
            Role
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value={ROLES.EMPLOYEE}>Employee</option>
              <option value={ROLES.ADMIN}>Admin</option>
            </select>
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="primary-btn wide-btn" type="submit">
            Sign Up
          </button>
          <Link className="ghost-btn wide-btn link-btn" to="/login" style={{ marginTop: '8px' }}>
            Back to login
          </Link>
        </form>
      </section>
    </main>
  )
}

export default SignupPage