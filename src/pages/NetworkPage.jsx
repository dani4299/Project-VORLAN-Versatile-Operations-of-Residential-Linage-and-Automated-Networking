import { useState } from 'react'
import { devices as initialDevices } from '../data/mockData'

function NetworkPage() {
  const [devices, setDevices] = useState(initialDevices)
  const [selected, setSelected] = useState(null)

  const updateStatus = (id, status) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)))
  }

  return (
    <main className="page">
      <h1>Network</h1>
      <p className="subtle">Manage device connectivity with instant status updates.</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>IP</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.id}>
                <td>{device.name}</td>
                <td>{device.ip}</td>
                <td>{device.type}</td>
                <td>
                  <span className={`status ${device.status}`}>{device.status}</span>
                </td>
                <td className="actions">
                  {device.status === 'paused' ? (
                    <button onClick={() => updateStatus(device.id, 'active')}>Resume</button>
                  ) : (
                    <button onClick={() => updateStatus(device.id, 'paused')}>Pause</button>
                  )}
                  <button onClick={() => setSelected(device)}>Info</button>
                  {device.status === 'kicked' ? (
                    <button onClick={() => updateStatus(device.id, 'active')}>Reconnect</button>
                  ) : (
                    <button onClick={() => updateStatus(device.id, 'kicked')}>Kick</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <section className="card">
          <h3>Device info</h3>
          <p>
            <strong>{selected.name}</strong> ({selected.type}) at {selected.ip}
          </p>
          <p className="muted">Current state: {selected.status}</p>
        </section>
      )}
    </main>
  )
}

export default NetworkPage
