import { useState } from 'react'

function AdminCamerasPage() {
  const [selected, setSelected] = useState(null)
  const cameraLabels = ['Entrance', 'Aisle', 'Back office', 'Storage']

  return (
    <main className="page admin-theme">
      <h1>Security Cameras</h1>
      <p className="subtle">Overview of core entrances, aisles, and back-office streams.</p>

      <section className="card warm-card">
        <div className="camera-grid">
          {cameraLabels.map((label, index) => (
            <button key={label} className="camera-tile clickable-camera" onClick={() => setSelected({ label, index })}>
              <div className="cam-overlay">
                <span>{label.toUpperCase()}</span>
                <small>Online · CAM-{index + 1}</small>
              </div>
            </button>
          ))}
        </div>
      </section>
      {selected && (
        <div className="modal-backdrop">
          <div className="modal-card camera-expanded">
            <h3>{selected.label} Camera Roll</h3>
            <div className="camera-expanded-view">Expanded feed · CAM-{selected.index + 1}</div>
            <button className="primary-btn wide-btn" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

export default AdminCamerasPage
