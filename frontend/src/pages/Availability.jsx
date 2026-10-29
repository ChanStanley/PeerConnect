// ===== Imports =====
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import '../components/flow-layout.css' // shared sidebar layout
import './Availability.css'

// ===== Constants =====
const CURRENT_STEP = 5 // Availability is the last step
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const TIMES = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM']

// Click a cell to cycle: unavailable -> preferred -> possible -> unavailable
const NEXT = { unavailable: 'preferred', preferred: 'possible', possible: 'unavailable' }

const LENGTHS = ['30–45 minutes', '45–60 minutes', '60–90 minutes', '90+ minutes']
const GROUP_SIZES = ['2–3 students', '2–4 students', '4–6 students']
const PLACES = ['Library', 'Online']

// ===== Helpers =====
// Reads the answers saved earlier (if any) so the sidebar can show them.
// Falls back to short placeholder text if nothing was saved.
function loadProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem('profile')) || {}
    return {
      campus: saved.campus || 'Completed',
      courses: Array.isArray(saved.courses) && saved.courses.length ? saved.courses.join(' - ') : 'Completed',
      style: Array.isArray(saved.style) && saved.style.length ? saved.style.join(' - ') : 'Completed',
    }
  } catch {
    return { campus: 'Completed', courses: 'Completed', style: 'Completed' }
  }
}
const PROFILE = loadProfile()

export default function Availability() {
  const navigate = useNavigate()

  // ===== State =====
  // availability: map of "Day-Time" -> 'preferred' | 'possible' (missing = unavailable)
  const [availability, setAvailability] = useState({})
  const [length, setLength] = useState('60–90 minutes')
  const [groupSize, setGroupSize] = useState('2–4 students')
  const [places, setPlaces] = useState(['Library', 'Online'])

  // How many time windows are selected (shown in the sidebar)
  const windowCount = Object.values(availability).filter((v) => v !== 'unavailable').length

  // ===== Sidebar steps =====
  // Steps 1-4 are done by the time the user gets here; Availability is current
  const steps = [
    { title: 'Account', detail: 'Created' },
    { title: 'Campus', detail: PROFILE.campus },
    { title: 'Courses', detail: PROFILE.courses },
    { title: 'Goals & style', detail: PROFILE.style },
    { title: 'Availability', detail: `${windowCount} weekly windows` },
  ]

  // ===== Handlers =====
  // Cycles a calendar cell to its next state
  const cycleCell = (key) => {
    setAvailability((prev) => ({ ...prev, [key]: NEXT[prev[key] ?? 'unavailable'] }))
  }

  // Adds or removes a place from the "Where?" list
  const togglePlace = (place) => {
    setPlaces((prev) => (prev.includes(place) ? prev.filter((p) => p !== place) : [...prev, place]))
  }

  // Finish: save availability, then go to matches
  const handleFinish = () => {
    // TODO: save { availability, length, groupSize, places } to the API
    localStorage.setItem('availability', JSON.stringify({ availability, length, groupSize, places }))
    navigate('/matches')
  }

  // ===== Page layout =====
  return (
    <div className="onb">
      {/* Left: progress sidebar */}
      <aside className="onb-side">
        <Logo />

        <div className="onb-side-body">
          <h2>Build your study profile</h2>
          <p className="onb-side-sub">A few details help us find classmates who fit your rhythm.</p>

          {/* Step list: steps before the current one show as done */}
          <ol className="steps">
            {steps.map((step, i) => {
              const n = i + 1
              const state = n < CURRENT_STEP ? 'done' : n === CURRENT_STEP ? 'current' : 'todo'
              return (
                <li key={step.title} className={`step ${state}`} aria-current={state === 'current' ? 'step' : undefined}>
                  <span className="marker" aria-hidden="true">
                    {state === 'done' ? '✓' : ''}
                  </span>
                  <span>
                    <strong>{step.title}</strong>
                    <small>{step.detail}</small>
                  </span>
                </li>
              )
            })}
          </ol>

          <p className="privacy">
            Your availability is shown only as matching windows, never your full calendar.
          </p>
        </div>
      </aside>

      {/* Right: calendar step */}
      <main className="onb-main">
        <p className="step-label">Step {CURRENT_STEP} of {steps.length}</p>
        <h1>When do you like to study?</h1>
        <p className="onb-sub">Choose typical windows. You can fine-tune these anytime.</p>

        <div className="avail-layout">
          {/* ----- Weekly availability calendar ----- */}
          <section className="panel">
            <div className="panel-head">
              <h2>Weekly availability</h2>
              <button type="button" className="link-btn" onClick={() => setAvailability({})}>
                Clear all
              </button>
            </div>

            {/* Legend for the three cell states */}
            <div className="legend">
              <span className="chip preferred">Preferred</span>
              <span className="chip possible">Possible</span>
              <span className="chip unavailable">Unavailable</span>
            </div>

            {/* Day headers + one button per day/time cell */}
            <div className="avail-grid">
              {DAYS.map((day) => (
                <div key={day} className="day-head">{day}</div>
              ))}
              {TIMES.map((time) =>
                DAYS.map((day) => {
                  const key = `${day}-${time}`
                  const state = availability[key] ?? 'unavailable'
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`cell ${state}`}
                      aria-label={`${day} ${time}: ${state}`}
                      onClick={() => cycleCell(key)}
                    >
                      {time}
                    </button>
                  )
                })
              )}
            </div>
          </section>

          {/* ----- Session preferences + buttons ----- */}
          <aside className="avail-side">
            <section className="panel prefs">
              <h2>Session preferences</h2>

              {/* Session length */}
              <label className="pref">
                <span>Ideal session length</span>
                <select className="input" value={length} onChange={(e) => setLength(e.target.value)}>
                  {LENGTHS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </label>

              {/* Group size */}
              <label className="pref">
                <span>Group size</span>
                <select className="input" value={groupSize} onChange={(e) => setGroupSize(e.target.value)}>
                  {GROUP_SIZES.map((g) => <option key={g}>{g}</option>)}
                </select>
              </label>

              {/* Where to meet */}
              <div className="pref">
                <span>Where?</span>
                <div className="chips">
                  {PLACES.map((place) => (
                    <button
                      key={place}
                      type="button"
                      className={`chip-btn ${places.includes(place) ? 'on' : ''}`}
                      aria-pressed={places.includes(place)}
                      onClick={() => togglePlace(place)}
                    >
                      {place}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Finish / Back buttons */}
            <button type="button" className="btn btn-primary" onClick={handleFinish}>
              Finish &amp; see my matches
            </button>
            <button type="button" className="btn" onClick={() => navigate('/onboarding')}>
              Back
            </button>
          </aside>
        </div>
      </main>
    </div>
  )
}