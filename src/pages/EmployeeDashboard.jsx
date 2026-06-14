import { useEffect, useMemo, useState } from 'react'
import { Bot, HardDrive, Network, Sparkles, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'
import { devices, reminders } from '../data/mockData'

const weatherCodeMap = {
  0: { label: 'Clear sky', icon: 'sun' },
  1: { label: 'Mainly clear', icon: 'sun-cloud' },
  2: { label: 'Partly cloudy', icon: 'sun-cloud' },
  3: { label: 'Overcast', icon: 'cloud' },
  45: { label: 'Fog', icon: 'cloud' },
  48: { label: 'Depositing rime fog', icon: 'cloud' },
  51: { label: 'Light drizzle', icon: 'rain' },
  61: { label: 'Light rain', icon: 'rain' },
  63: { label: 'Rain', icon: 'rain' },
  71: { label: 'Snow', icon: 'cloud' },
  80: { label: 'Rain showers', icon: 'rain' },
}

function EmployeeDashboard() {
  const [weather, setWeather] = useState({
    loading: true,
    temp: '-',
    city: 'California',
    desc: 'Loading',
    icon: 'sun-cloud',
  })

  useEffect(() => {
    async function loadWeather() {
      try {
        // San Francisco coordinates for California weather snapshot.
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current=temperature_2m,weather_code&timezone=auto',
        )
        const data = await response.json()
        const weatherMeta = weatherCodeMap[data.current?.weather_code] ?? {
          label: 'Moderate conditions',
          icon: 'sun-cloud',
        }
        setWeather({
          loading: false,
          temp: Math.round(data.current?.temperature_2m ?? 0),
          city: 'California',
          desc: weatherMeta.label,
          icon: weatherMeta.icon,
        })
      } catch (error) {
        setWeather({
          loading: false,
          temp: '-',
          city: 'California',
          desc: 'Weather unavailable',
          icon: 'cloud',
        })
      }
    }
    loadWeather()
  }, [])

  const connectedCount = useMemo(
    () => devices.filter((device) => device.status === 'active').length,
    [],
  )

  return (
    <main className="page">
      <h1>Employee Dashboard</h1>
      <p className="subtle">Operations, network, storage, and assistant tools</p>

      <section className="grid two-col">
        <article className="card weather-widget">
          <div className="widget-head">
            <h3 className="title-with-icon"><Sun size={16} /> California Weather</h3>
            <span className="chip">Live</span>
          </div>
          <div className="weather-hero">
            <div className={`weather-icon ${weather.icon}`}>
              <span className="sun-core" />
              <span className="cloud-core" />
            </div>
            <div>
              <p className="temp">{weather.loading ? '--' : `${weather.temp} C`}</p>
              <p className="muted">
                {weather.loading ? 'Loading weather...' : `${weather.city} - ${weather.desc}`}
              </p>
            </div>
          </div>
          <h4>Reminders</h4>
          <ul className="tight-list">
            {reminders.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong> - {item.when}
              </li>
            ))}
          </ul>
        </article>

        <article className="card ai-glow">
          <h3 className="title-with-icon"><Bot size={16} /> AI assistant widget</h3>
          <p>Ask inventory and operations questions in natural language.</p>
          <Link className="primary-btn link-btn strong-btn" to="/ai">
            Open full chat →
          </Link>
        </article>

        <article className="card">
          <h3 className="title-with-icon"><Network size={16} /> Network summary</h3>
          <p>{connectedCount} active devices currently online.</p>
          <Link className="primary-btn link-btn subtle-btn" to="/network">
            Open network panel
          </Link>
        </article>

        <article className="card">
          <h3 className="title-with-icon"><HardDrive size={16} /> Storage summary</h3>
          <p>78% used (4.68 TB / 6 TB)</p>
          <Link className="primary-btn link-btn subtle-btn" to="/storage">
            Open storage view
          </Link>
        </article>
      </section>

      <section className="card">
        <h3 className="title-with-icon"><Sparkles size={16} /> AI quick input</h3>
        <div className="ai-input-bar">
          <input readOnly value="Which inventory item should be reordered first?" />
          <Link className="primary-btn link-btn ask-btn" to="/ai">
            Ask →
          </Link>
        </div>
      </section>
    </main>
  )
}

export default EmployeeDashboard
