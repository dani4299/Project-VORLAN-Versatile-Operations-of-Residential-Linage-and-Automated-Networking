import { useEffect, useMemo, useState } from 'react'
import { Plus, Save, Trash2 } from 'lucide-react'
import { files } from '../data/mockData'
import { loadInventory, saveInventory } from '../utils/inventory'

function StoragePage() {
  const total = 6
  const used = 4.68
  const pct = Math.round((used / total) * 100)
  const [rows, setRows] = useState([])
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState({
    sku: '',
    item: '',
    qty: 0,
    location: '',
    category: '',
    reorderLevel: 0,
  })

  useEffect(() => {
    setRows(loadInventory())
  }, [])

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const text = `${row.sku} ${row.item} ${row.location} ${row.category}`.toLowerCase()
      return text.includes(query.toLowerCase())
    })
  }, [rows, query])

  const updateCell = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: field === 'qty' || field === 'reorderLevel' ? Number(value) : value } : row,
      ),
    )
  }

  const addRow = () => {
    if (!draft.sku || !draft.item) return
    const next = { ...draft, id: Date.now(), qty: Number(draft.qty), reorderLevel: Number(draft.reorderLevel) }
    const updated = [...rows, next]
    setRows(updated)
    saveInventory(updated)
    setDraft({ sku: '', item: '', qty: 0, location: '', category: '', reorderLevel: 0 })
  }

  const removeRow = (id) => {
    const updated = rows.filter((row) => row.id !== id)
    setRows(updated)
    saveInventory(updated)
  }

  const persist = () => saveInventory(rows)

  return (
    <main className="page">
      <h1>Storage screen</h1>
      <section className="card">
        <h3>Usage</h3>
        <p>
          {used} TB / {total} TB ({pct}%)
        </p>
        <div className="progress">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </section>

      <section className="grid two-col">
        <article className="card">
          <h3>File type breakdown</h3>
          <ul className="tight-list">
            <li>Video: 42%</li>
            <li>Backups: 25%</li>
            <li>Documents: 13%</li>
            <li>Images: 10%</li>
            <li>Other: 10%</li>
          </ul>
        </article>

        <article className="card">
          <h3>Recent files</h3>
          <ul className="tight-list">
            {files.map((file) => (
              <li key={file.id}>
                {file.name} - {file.size} ({file.updated})
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="card">
        <div className="widget-head">
          <h3>Inventory spreadsheet</h3>
          <div className="toolbar-row">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sku, product, location..."
            />
            <button className="primary-btn icon-btn" onClick={persist}>
              <Save size={16} />
              Save
            </button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th />
                <th>SKU</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Location</th>
                <th>Category</th>
                <th>Reorder</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className={row.qty <= row.reorderLevel ? 'low-stock' : ''}>
                  <td>
                    <button className="icon-only-btn" onClick={() => removeRow(row.id)} title="Delete row">
                      <Trash2 size={15} />
                    </button>
                  </td>
                  <td>
                    <input value={row.sku} onChange={(e) => updateCell(row.id, 'sku', e.target.value)} />
                  </td>
                  <td>
                    <input value={row.item} onChange={(e) => updateCell(row.id, 'item', e.target.value)} />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.qty}
                      onChange={(e) => updateCell(row.id, 'qty', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      value={row.location}
                      onChange={(e) => updateCell(row.id, 'location', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      value={row.category || ''}
                      onChange={(e) => updateCell(row.id, 'category', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.reorderLevel || 0}
                      onChange={(e) => updateCell(row.id, 'reorderLevel', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <button className="icon-only-btn" onClick={addRow} title="Add row">
                    <Plus size={15} />
                  </button>
                </td>
                <td>
                  <input
                    value={draft.sku}
                    onChange={(e) => setDraft((prev) => ({ ...prev, sku: e.target.value }))}
                  />
                </td>
                <td>
                  <input
                    value={draft.item}
                    onChange={(e) => setDraft((prev) => ({ ...prev, item: e.target.value }))}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={draft.qty}
                    onChange={(e) => setDraft((prev) => ({ ...prev, qty: e.target.value }))}
                  />
                </td>
                <td>
                  <input
                    value={draft.location}
                    onChange={(e) => setDraft((prev) => ({ ...prev, location: e.target.value }))}
                  />
                </td>
                <td>
                  <input
                    value={draft.category}
                    onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value }))}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={draft.reorderLevel}
                    onChange={(e) => setDraft((prev) => ({ ...prev, reorderLevel: e.target.value }))}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default StoragePage
