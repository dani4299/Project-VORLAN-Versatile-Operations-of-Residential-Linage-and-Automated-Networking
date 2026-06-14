import { useMemo, useState } from 'react'

const seedRecords = {
  passwords: [
    { id: 1, account: 'Bank Portal', username: 'finance_ops', password: 'b4nk!Secure#2026' },
    { id: 2, account: 'Cloud Cameras', username: 'security_admin', password: 'Cam$Vault889' },
  ],
  statements: [
    { id: 1, title: 'Q1 Revenue Statement', amount: '$1.24M', status: 'Reviewed' },
    { id: 2, title: 'Operations Expense Sheet', amount: '$312K', status: 'Pending' },
  ],
  employees: [
    { id: 1, name: 'Aisha Malik', dept: 'Operations', access: 'Full' },
    { id: 2, name: 'Bilal Ahmed', dept: 'IT', access: 'Standard' },
    { id: 3, name: 'Sana Rehman', dept: 'Analytics', access: 'Standard' },
  ],
}

const STORAGE_KEY = 'vorlan_admin_records'

function AdminNotesPage() {
  const initial = useMemo(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : seedRecords
  }, [])
  const [records, setRecords] = useState(initial)
  const [status, setStatus] = useState('')
  const [generalNotes, setGeneralNotes] = useState(
    localStorage.getItem('vorlan_secure_notes') ||
      'Priority updates:\n- Rotate privileged credentials monthly.\n- Validate camera retention policy weekly.',
  )

  const saveAll = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
    localStorage.setItem('vorlan_secure_notes', generalNotes)
    setStatus('Saved securely at ' + new Date().toLocaleTimeString())
  }

  const updateVault = (id, field, value) => {
    setRecords((prev) => ({
      ...prev,
      passwords: prev.passwords.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    }))
  }

  const addVault = () => {
    setRecords((prev) => ({
      ...prev,
      passwords: [
        ...prev.passwords,
        { id: Date.now(), account: 'New Account', username: 'user', password: 'password' },
      ],
    }))
  }

  const deleteVault = (id) => {
    setRecords((prev) => ({
      ...prev,
      passwords: prev.passwords.filter((row) => row.id !== id),
    }))
  }

  const [notesList, setNotesList] = useState([
    { id: 1, title: 'Operations note', content: 'Review nightly backup success status.' },
  ])

  const updateNote = (id, field, value) => {
    setNotesList((prev) => prev.map((note) => (note.id === id ? { ...note, [field]: value } : note)))
  }

  const addNote = () => {
    setNotesList((prev) => [...prev, { id: Date.now(), title: 'New note', content: 'Write details...' }])
  }

  const deleteNote = (id) => {
    setNotesList((prev) => prev.filter((note) => note.id !== id))
  }

  return (
    <main className="page admin-theme">
      <h1>Secure Records</h1>
      <p className="subtle">Controlled records workspace for sensitive operations data.</p>

      <section className="grid two-col">
        <article className="card warm-card">
          <h3>Password vault</h3>
          <button className="admin-btn link-btn" onClick={addVault}>
            Add vault row
          </button>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th />
                  <th>Account</th>
                  <th>Username</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                {records.passwords.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <button className="icon-only-btn" onClick={() => deleteVault(row.id)}>
                        ×
                      </button>
                    </td>
                    <td>
                      <input value={row.account} onChange={(e) => updateVault(row.id, 'account', e.target.value)} />
                    </td>
                    <td>
                      <input
                        value={row.username}
                        onChange={(e) => updateVault(row.id, 'username', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={row.password}
                        onChange={(e) => updateVault(row.id, 'password', e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="card warm-card">
          <h3>Bank statements</h3>
          <ul className="tight-list">
            {records.statements.map((statement) => (
              <li key={statement.id}>
                <strong>{statement.title}</strong> - {statement.amount} ({statement.status})
              </li>
            ))}
          </ul>
        </article>

        <article className="card warm-card">
          <h3>Employee profile registry</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Access</th>
                </tr>
              </thead>
              <tbody>
                {records.employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.name}</td>
                    <td>{employee.dept}</td>
                    <td>{employee.access}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="card warm-card">
          <h3>Business analytics snapshots</h3>
          <div className="kpi-grid">
            <div className="kpi-card">
              <span>Monthly Revenue</span>
              <strong>$412K</strong>
            </div>
            <div className="kpi-card">
              <span>Storage Growth</span>
              <strong>+8.2%</strong>
            </div>
            <div className="kpi-card">
              <span>Camera Uptime</span>
              <strong>99.7%</strong>
            </div>
            <div className="kpi-card">
              <span>Network Stability</span>
              <strong>98.9%</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="card warm-card">
        <div className="widget-head">
          <h3>Private notes</h3>
          <button className="admin-btn link-btn" onClick={addNote}>
            Add note
          </button>
        </div>
        <div className="grid two-col">
          {notesList.map((note) => (
            <article key={note.id} className="kpi-card">
              <input value={note.title} onChange={(e) => updateNote(note.id, 'title', e.target.value)} />
              <textarea
                className="notes-area"
                value={note.content}
                onChange={(e) => updateNote(note.id, 'content', e.target.value)}
              />
              <button className="ghost-btn" onClick={() => deleteNote(note.id)}>
                Delete
              </button>
            </article>
          ))}
        </div>
        <textarea
          className="notes-area"
          value={generalNotes}
          onChange={(event) => setGeneralNotes(event.target.value)}
        />
        <div className="toolbar-row">
          <button className="admin-btn" onClick={saveAll}>
            Save records
          </button>
          {status && <span className="muted">{status}</span>}
        </div>
      </section>
    </main>
  )
}

export default AdminNotesPage
