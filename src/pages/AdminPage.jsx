import { useEffect, useMemo, useState } from 'react'
import { Bot, Camera, HardDrive, Network, Plus, ShieldCheck, Sun, Trash2, Users } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { defaultUsers, devices, reminders } from '../data/mockData'

const ACCOUNTS_KEY = 'vorlan_accounts'
const weatherCodeMap = {
  0: { label: 'Clear sky' },
  1: { label: 'Mainly clear' },
  2: { label: 'Partly cloudy' },
  3: { label: 'Overcast' },
}

function AdminPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState(defaultUsers)
  const [activeTab, setActiveTab] = useState('overview')
  const [draft, setDraft] = useState({ name: '', email: '', role: 'Employee' })
  const [weather, setWeather] = useState({ loading: true, temp: '-', city: 'California', desc: '' })

  useEffect(() => {
    const stored = localStorage.getItem(ACCOUNTS_KEY)
    if (!stored) return
    const accounts = JSON.parse(stored)
    const extraUsers = accounts.map((acc) => ({
      id: acc.id,
      name: acc.name,
      email: acc.email,
      role: acc.role === 'employee' ? 'Employee' : acc.role === 'admin' ? 'Admin' : acc.role,
    }))
    setUsers((prev) => {
      const existingIds = new Set(prev.map((u) => u.id))
      return [...prev, ...extraUsers.filter((u) => !existingIds.has(u.id))]
    })
  }, [])

  useEffect(() => {
    async function loadWeather() {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current=temperature_2m,weather_code&timezone=auto',
        )
        const data = await response.json()
        setWeather({
          loading: false,
          temp: Math.round(data.current?.temperature_2m ?? 0),
          city: 'California',
          desc: weatherCodeMap[data.current?.weather_code]?.label || 'Moderate conditions',
        })
      } catch {
        setWeather({ loading: false, temp: '-', city: 'California', desc: 'Weather unavailable' })
      }
    }
    loadWeather()
  }, [])

  const connectedCount = useMemo(
    () => devices.filter((device) => device.status === 'active').length,
    [],
  )

  const updateRole = (id, role) => {
    setUsers((prev) => {
      const updated = prev.map((u) => (u.id === id ? { ...u, role } : u))
      saveUsers(updated)
      return updated
    })
  }

  const updateUserField = (id, field, value) => {
    setUsers((prev) => {
      const updated = prev.map((u) => (u.id === id ? { ...u, [field]: value } : u))
      saveUsers(updated)
      return updated
    })
  }

  const deleteUser = (id) => {
    setUsers((prev) => {
      const updated = prev.filter((u) => u.id !== id)
      saveUsers(updated)
      return updated
    })
  }

  const addUser = () => {
    if (!draft.name || !draft.email) return
    const updated = [...users, { ...draft, id: Date.now() }]
    setUsers(updated)
    saveUsers(updated)
    setDraft({ name: '', email: '', role: 'Employee' })
  }

  const saveUsers = (list) => {
    const accounts = list
      .filter((u) => u.email?.includes('@'))
      .map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        username: u.email.split('@')[0],
        password: 'changeme123',
        role: u.role.toLowerCase(),
        approved: true,
      }))
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
  }

  return (
    <main className="page admin-theme">
      <h1>Admin Dashboard</h1>
      <p className="subtle">Security operations, user controls, and protected records.</p>
      <section className="tab-row">
        <button
          className={activeTab === 'overview' ? 'primary-btn tab-btn' : 'ghost-btn tab-btn'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'users' ? 'primary-btn tab-btn' : 'ghost-btn tab-btn'}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button className="ghost-btn tab-btn" onClick={() => navigate('/admin/cameras')}>
          Cameras
        </button>
        <button className="ghost-btn tab-btn" onClick={() => navigate('/admin/notes')}>
          Secure Records
        </button>
      </section>

      {activeTab === 'overview' ? (
        <section className="grid two-col">
          <article className="card weather-widget">
            <div className="widget-head">
              <h3 className="title-with-icon"><Sun size={16} /> California Weather</h3>
              <span className="chip warm">Live</span>
            </div>
            <p className="temp">{weather.loading ? '--' : `${weather.temp} C`}</p>
            <p className="muted">
              {weather.loading ? 'Loading weather...' : `${weather.city} - ${weather.desc}`}
            </p>
            <ul className="tight-list">
              {reminders.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong> - {item.when}
                </li>
              ))}
            </ul>
          </article>

          <article className="card warm-card">
            <h3 className="title-with-icon"><Bot size={16} /> AI assistant widget</h3>
            <p>Ask operations and inventory questions instantly.</p>
            <Link className="primary-btn link-btn strong-btn" to="/ai">
              Open full chat →
            </Link>
          </article>

          <article className="card warm-card">
            <h3 className="title-with-icon"><Network size={16} /> Network summary</h3>
            <p>{connectedCount} active devices currently online.</p>
            <Link className="primary-btn link-btn subtle-btn" to="/network">
              Open network panel
            </Link>
          </article>

          <article className="card warm-card">
            <h3 className="title-with-icon"><HardDrive size={16} /> Storage summary</h3>
            <p>78% used (4.68 TB / 6 TB)</p>
            <Link className="primary-btn link-btn subtle-btn" to="/storage">
              Open storage view
            </Link>
          </article>
        </section>
      ) : (
        <section className="card warm-card">
          <h3 className="title-with-icon"><Users size={16} /> User Management (CRUD)</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th />
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <button className="icon-only-btn" onClick={() => deleteUser(user.id)}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                    <td>
                      <input
                        value={user.name}
                        onChange={(e) => updateUserField(user.id, 'name', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={user.email}
                        onChange={(e) => updateUserField(user.id, 'email', e.target.value)}
                      />
                    </td>
                    <td>
                      <select value={user.role} onChange={(e) => updateRole(user.id, e.target.value)}>
                        <option>Admin</option>
                        <option>Employee</option>
                        <option>Guest</option>
                      </select>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td>
                    <button className="icon-only-btn" onClick={addUser}>
                      <Plus size={14} />
                    </button>
                  </td>
                  <td>
                    <input
                      value={draft.name}
                      onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </td>
                  <td>
                    <input
                      value={draft.email}
                      onChange={(e) => setDraft((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </td>
                  <td>
                    <select
                      value={draft.role}
                      onChange={(e) => setDraft((prev) => ({ ...prev, role: e.target.value }))}
                    >
                      <option>Admin</option>
                      <option>Employee</option>
                      <option>Guest</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  )
}

export default AdminPage
